# ============================================================
# Simulate Conjoint Ratings Data — 4 Segments
# ============================================================
# Approach:
#   1. Draw random parameter vectors in chunks:
#      - Non-price dummies: U(0, 30)
#      - Price dummies: U(-30, 0)
#      - Sort within attributes for monotonicity
#   2. Worst profile (all base + worst price) → rating ≈ 0
#      Best profile (all max + base price) → rating ≈ 100
#      Filter draws where utility range is in [90, 110]
#   3. Add observation noise: SD=20 for Seg1-3, SD=8 for Seg4
#   4. OLS → importance → segment at 20% threshold
#   5. Accumulate respondents in 4 target segments
#   6. Stop when all targets met, sample 35/28/22/15
# ============================================================

set.seed(1)

# --- 1. Read design ---
design <- read.csv("conjoint_dummyprofiles.csv")
X <- as.matrix(design[, -1])
n_profiles <- nrow(X)
n_dummies  <- ncol(X)

cat("Design matrix:", n_profiles, "profiles x", n_dummies, "dummies\n")

# --- 2. Setup ---
noise_sd_low  <- 8    # for Seg4 (rare, needs clean recovery)
noise_sd_high <- 20   # for Seg1-3 (lower R²)
threshold <- 20
range_lo  <- 90
range_hi  <- 110

attr_names_vec <- c("Channels", "Movie", "DVR", "Price", "Internet", "Phone")

target_segments <- c(
  "Price, Internet",
  "Channels, Internet",
  "Channels, Internet, Phone",
  "Channels, Movie, Internet, Phone"
)
target_sizes <- c(35, 28, 22, 15)
names(target_sizes) <- target_segments

# OLS projection matrix (precompute once)
X_aug <- cbind(1, X)
M <- solve(t(X_aug) %*% X_aug) %*% t(X_aug)

non_price_idx <- c(1:7, 13:16)
price_idx     <- 8:12

# Storage for each target segment
seg_pool <- list()
for (seg in target_segments) seg_pool[[seg]] <- list()

# --- 3. Generate in chunks until all targets met ---
chunk_size  <- 1000000
max_chunks  <- 50
total_draws <- 0

for (chunk in 1:max_chunks) {
  cat(sprintf("\n--- Chunk %d (%.0fM draws so far) ---\n", chunk, total_draws / 1e6))

  # Generate random betas
  betas <- matrix(0, nrow = chunk_size, ncol = n_dummies)
  betas[, non_price_idx] <- runif(chunk_size * 11, 0, 30)
  betas[, price_idx]     <- runif(chunk_size * 5, -30, 0)

  # Monotonicity: Channels (3-element sorting network)
  a <- betas[,1]; b <- betas[,2]; c <- betas[,3]
  lo <- pmin(a,b); hi <- pmax(a,b); a <- lo; b <- hi
  lo <- pmin(a,c); hi <- pmax(a,c); a <- lo; c <- hi
  lo <- pmin(b,c); hi <- pmax(b,c); b <- lo; c <- hi
  betas[,1] <- a; betas[,2] <- b; betas[,3] <- c

  # Movie
  lo <- pmin(betas[,4], betas[,5]); hi <- pmax(betas[,4], betas[,5])
  betas[,4] <- lo; betas[,5] <- hi

  # DVR
  lo <- pmin(betas[,6], betas[,7]); hi <- pmax(betas[,6], betas[,7])
  betas[,6] <- lo; betas[,7] <- hi

  # Price (5-element sorting network on |values|)
  a <- abs(betas[,8]); b <- abs(betas[,9]); c <- abs(betas[,10])
  d <- abs(betas[,11]); e <- abs(betas[,12])
  lo <- pmin(a,b); hi <- pmax(a,b); a <- lo; b <- hi
  lo <- pmin(d,e); hi <- pmax(d,e); d <- lo; e <- hi
  lo <- pmin(c,e); hi <- pmax(c,e); c <- lo; e <- hi
  lo <- pmin(c,d); hi <- pmax(c,d); c <- lo; d <- hi
  lo <- pmin(a,d); hi <- pmax(a,d); a <- lo; d <- hi
  lo <- pmin(a,c); hi <- pmax(a,c); a <- lo; c <- hi
  lo <- pmin(b,e); hi <- pmax(b,e); b <- lo; e <- hi
  lo <- pmin(b,d); hi <- pmax(b,d); b <- lo; d <- hi
  lo <- pmin(b,c); hi <- pmax(b,c); b <- lo; c <- hi
  betas[,8] <- -a; betas[,9] <- -b; betas[,10] <- -c
  betas[,11] <- -d; betas[,12] <- -e

  # Internet
  lo <- pmin(betas[,13], betas[,14]); hi <- pmax(betas[,13], betas[,14])
  betas[,13] <- lo; betas[,14] <- hi

  # Phone
  lo <- pmin(betas[,15], betas[,16]); hi <- pmax(betas[,15], betas[,16])
  betas[,15] <- lo; betas[,16] <- hi

  # Utility range filter
  u_worst <- betas[, 12]
  u_best  <- betas[,3] + betas[,5] + betas[,7] + betas[,14] + betas[,16]
  u_range <- u_best - u_worst

  keep <- which(u_range >= range_lo & u_range <= range_hi)
  if (length(keep) == 0) { total_draws <- total_draws + chunk_size; next }

  betas_f      <- betas[keep, , drop = FALSE]
  intercepts_f <- -u_worst[keep]
  n_valid      <- nrow(betas_f)

  # Compute predicted ratings (deterministic)
  Y_pred <- X %*% t(betas_f)
  Y_pred <- sweep(Y_pred, 2, intercepts_f, "+")

  # Helper: run OLS, importance, segmentation at a given noise level
  run_ols_seg <- function(Y_pred, sd_noise, n_valid) {
    Y_noisy <- Y_pred + matrix(rnorm(n_profiles * n_valid, 0, sd_noise),
                                nrow = n_profiles, ncol = n_valid)
    Y_final <- round(pmin(pmax(Y_noisy, 1), 100))

    B      <- M %*% Y_final
    pw     <- B[-1, , drop = FALSE]
    Y_hat  <- X_aug %*% B
    resid  <- Y_final - Y_hat
    SS_res <- colSums(resid^2)
    Y_mean <- colMeans(Y_final)
    Y_cent <- sweep(Y_final, 2, Y_mean, "-")
    SS_tot <- colSums(Y_cent^2)
    r_sq   <- 1 - SS_res / SS_tot

    ch_r <- pmax(0, pw[1,], pw[2,], pw[3,]) - pmin(0, pw[1,], pw[2,], pw[3,])
    mv_r <- pmax(0, pw[4,], pw[5,])          - pmin(0, pw[4,], pw[5,])
    dv_r <- pmax(0, pw[6,], pw[7,])          - pmin(0, pw[6,], pw[7,])
    pr_r <- pmax(0, pw[8,], pw[9,], pw[10,], pw[11,], pw[12,]) -
            pmin(0, pw[8,], pw[9,], pw[10,], pw[11,], pw[12,])
    in_r <- pmax(0, pw[13,], pw[14,])        - pmin(0, pw[13,], pw[14,])
    ph_r <- pmax(0, pw[15,], pw[16,])        - pmin(0, pw[15,], pw[16,])
    tot  <- ch_r + mv_r + dv_r + pr_r + in_r + ph_r
    imp  <- cbind(ch_r, mv_r, dv_r, pr_r, in_r, ph_r) / tot * 100

    is_imp <- imp >= threshold
    labels <- apply(is_imp, 1, function(row) paste(attr_names_vec[row], collapse = ", "))

    list(Y = Y_final, B = B, r_sq = r_sq, labels = labels)
  }

  # Run at HIGH noise (for Seg1-3: lower R²)
  res_high <- run_ols_seg(Y_pred, noise_sd_high, n_valid)
  # Run at LOW noise (for Seg4: clean recovery)
  res_low  <- run_ols_seg(Y_pred, noise_sd_low, n_valid)

  # Accumulate: Seg1-3 from high noise, Seg4 from low noise
  seg4_name <- "Channels, Movie, Internet, Phone"
  for (seg in target_segments) {
    if (length(seg_pool[[seg]]) >= target_sizes[seg]) next
    if (seg == seg4_name) {
      # Use LOW noise for Seg4
      idx <- which(res_low$labels == seg)
      for (i in idx) {
        if (length(seg_pool[[seg]]) >= target_sizes[seg]) break
        seg_pool[[seg]][[length(seg_pool[[seg]]) + 1]] <- list(
          ratings = res_low$Y[, i], r_sq = res_low$r_sq[i], betas_ols = res_low$B[, i]
        )
      }
    } else {
      # Use HIGH noise for Seg1-3
      idx <- which(res_high$labels == seg)
      for (i in idx) {
        if (length(seg_pool[[seg]]) >= target_sizes[seg]) break
        seg_pool[[seg]][[length(seg_pool[[seg]]) + 1]] <- list(
          ratings = res_high$Y[, i], r_sq = res_high$r_sq[i], betas_ols = res_high$B[, i]
        )
      }
    }
  }

  total_draws <- total_draws + chunk_size

  # Status
  all_met <- TRUE
  for (seg in target_segments) {
    n_have <- length(seg_pool[[seg]])
    cat(sprintf("  %-40s %3d / %d\n", seg, n_have, target_sizes[seg]))
    if (n_have < target_sizes[seg]) all_met <- FALSE
  }

  if (all_met) {
    cat(sprintf("\nAll targets met after %dM draws!\n", total_draws / 1e6))
    break
  }
}

if (!all_met) {
  cat(sprintf("\nWARNING: Not all targets met after %dM draws.\n", total_draws / 1e6))
  for (seg in target_segments) {
    cat(sprintf("  %-40s %3d / %d\n", seg, length(seg_pool[[seg]]), target_sizes[seg]))
  }
}

# --- 4. Assemble final dataset ---
ratings_list <- list()
r_sq_list    <- numeric(0)
betas_list   <- list()
seg_list     <- character(0)

for (seg in target_segments) {
  pool <- seg_pool[[seg]]
  n_take <- min(length(pool), target_sizes[seg])
  for (i in 1:n_take) {
    ratings_list[[length(ratings_list) + 1]] <- pool[[i]]$ratings
    r_sq_list    <- c(r_sq_list, pool[[i]]$r_sq)
    betas_list[[length(betas_list) + 1]] <- pool[[i]]$betas_ols
    seg_list     <- c(seg_list, seg)
  }
}

n_kept <- length(ratings_list)

# Shuffle
shuffle <- sample(n_kept)
ratings_matrix <- matrix(0, nrow = n_profiles, ncol = n_kept)
for (r in 1:n_kept) {
  ratings_matrix[, r] <- ratings_list[[shuffle[r]]]
}
r_sq_final   <- r_sq_list[shuffle]
seg_final    <- seg_list[shuffle]
betas_matrix <- matrix(0, nrow = n_dummies + 1, ncol = n_kept)
for (r in 1:n_kept) {
  betas_matrix[, r] <- betas_list[[shuffle[r]]]
}

# --- 5. Write CSV ---
ratings_df <- data.frame(Profile = 1:n_profiles, ratings_matrix)
colnames(ratings_df) <- c("Profile", paste0("Respondent_", 1:n_kept))
write.csv(ratings_df, "conjoint_ratings.csv", row.names = FALSE)

cat(sprintf("\nWrote conjoint_ratings.csv: %d profiles x %d respondents\n",
            n_profiles, n_kept))
cat("Rating range:", min(ratings_matrix), "-", max(ratings_matrix),
    "  mean:", round(mean(ratings_matrix), 1), "\n")

# --- 6. Verification ---
cat("\n--- Verification ---\n")
cat(sprintf("R-squared -- min: %.3f  mean: %.3f  max: %.3f\n",
            min(r_sq_final), mean(r_sq_final), max(r_sq_final)))

avg_beta <- rowMeans(betas_matrix)
dummy_names <- colnames(X)
cat("\nAverage part-worth utilities (OLS):\n")
cat("  Intercept:", round(avg_beta[1], 2), "\n")
for (j in 1:n_dummies) {
  cat(sprintf("  %-40s %+.2f\n", dummy_names[j], avg_beta[j + 1]))
}

b <- avg_beta[-1]
cat("\nMonotonicity (average OLS):\n")
cat("  Channels:  ", round(b[1],1), "<", round(b[2],1), "<", round(b[3],1),
    "?", b[1] < b[2] && b[2] < b[3], "\n")
cat("  Movie:     ", round(b[4],1), "<", round(b[5],1),
    "?", b[4] < b[5], "\n")
cat("  DVR:       ", round(b[6],1), "<", round(b[7],1),
    "?", b[6] < b[7], "\n")
cat("  Price:     ", round(b[8],1), ">", round(b[9],1), ">", round(b[10],1),
    ">", round(b[11],1), ">", round(b[12],1),
    "?", b[8] > b[9] && b[9] > b[10] && b[10] > b[11] && b[11] > b[12], "\n")
cat("  Internet:  ", round(b[13],1), "<", round(b[14],1),
    "?", b[13] < b[14], "\n")
cat("  Phone:     ", round(b[15],1), "<", round(b[16],1),
    "?", b[15] < b[16], "\n")

# Final segmentation
cat(sprintf("\n--- Final Segmentation (%d%% threshold) ---\n", threshold))
seg_table_f <- sort(table(seg_final), decreasing = TRUE)
for (i in seq_along(seg_table_f)) {
  cat(sprintf("  %-45s %3d respondents (%4.1f%%)\n",
              names(seg_table_f)[i], seg_table_f[i],
              seg_table_f[i] / n_kept * 100))
}

cat(sprintf("\nTotal draws used: %dM\n", total_draws / 1e6))
cat(sprintf("*** Set threshold to %d%% in the conjoint analysis tool ***\n", threshold))
