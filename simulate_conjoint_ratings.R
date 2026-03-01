# ============================================================
# Simulate Conjoint Ratings — 6 Product Types (Direct Construction)
# ============================================================
# 6 market offerings, each adding one feature tier:
#   Prod 1: 100Mbps, $30       (Basic Internet)
#   Prod 2: 300Mbps, $60       (Fast Internet)
#   Prod 3: 300Mbps+100ch, $90
#   Prod 4: 300Mbps+200ch, $120
#   Prod 5: 300Mbps+300ch, $150
#   Prod 6: 300Mbps+300ch+HBO+ST, $200
#
# Target market shares: ~28/23/18/15/10/6%
# Each respondent type is designed to prefer one product.
# ============================================================

set.seed(42)

# --- 1. Read design ---
design <- read.csv("conjoint_dummy_profiles.csv")
X <- as.matrix(design[, -1])
n_profiles <- nrow(X)
n_dummies  <- ncol(X)
X_aug <- cbind(1, X)
M <- solve(t(X_aug) %*% X_aug) %*% t(X_aug)

cat("Design matrix:", n_profiles, "profiles x", n_dummies, "dummies\n")

# --- 2. Market products (dummy-coded) ---
market <- matrix(c(
  0,0,0, 0,0, 0,0, 0,0,0,0,0, 1,0, 0,0,  # Prod 1: Int100, $30
  0,0,0, 0,0, 0,0, 1,0,0,0,0, 0,1, 0,0,  # Prod 2: Int300, $60
  1,0,0, 0,0, 0,0, 0,1,0,0,0, 0,1, 0,0,  # Prod 3: Ch100+Int300, $90
  0,1,0, 0,0, 0,0, 0,0,1,0,0, 0,1, 0,0,  # Prod 4: Ch200+Int300, $120
  0,0,1, 0,0, 0,0, 0,0,0,1,0, 0,1, 0,0,  # Prod 5: Ch300+Int300, $150
  0,0,1, 0,1, 0,0, 0,0,0,0,1, 0,1, 0,0   # Prod 6: Ch300+HBOST+Int300, $200
), nrow = 6, byrow = TRUE)
market_aug <- cbind(1, market)

prod_names <- c("Basic Internet", "Fast Internet", "Internet+100ch",
                "Internet+200ch", "Internet+300ch", "Full Package")

# --- 3. Type specifications ---
# [Ch, Mv, DVR, Pr, Int, Ph] importance targets (sum to 100)
type_targets <- list(
  c(5,  3, 3, 35, 47, 7),    # Type A → Prod 1: slow internet, very price sensitive
  c(7,  3, 3, 35, 45, 7),    # Type B → Prod 2: fast internet, price sensitive
  c(22, 4, 3, 28, 36, 7),    # Type C → Prod 3: 100ch sweet spot
  c(27, 4, 3, 26, 33, 7),    # Type D → Prod 4: 200ch sweet spot
  c(32, 3, 3, 24, 31, 7),    # Type E → Prod 5: values 300ch
  c(24, 22, 3, 15, 28, 8)    # Type F → Prod 6: values movie, low price sens
)
type_sizes <- c(28, 23, 18, 15, 10, 6)  # = 100 total
noise_sd <- 8

# --- 4. Beta generation ---
generate_betas <- function(imp_target, tid) {
  pert <- rnorm(6, 0, 1.5)
  imp <- pmax(imp_target + pert, 0.3)
  imp <- imp / sum(imp) * 100
  total_range <- runif(1, 92, 108)
  ranges <- imp / 100 * total_range
  b <- numeric(16)

  # Channels (1-3): ch_100, ch_200, ch_300
  r <- ranges[1]
  if (tid <= 2) {
    b[1] <- r * runif(1, 0.25, 0.45); b[2] <- r * runif(1, 0.55, 0.75); b[3] <- r
  } else if (tid == 3) {
    # 100ch captures most value
    b[1] <- r * runif(1, 0.75, 0.90); b[2] <- r * runif(1, 0.92, 0.97); b[3] <- r
  } else if (tid == 4) {
    # 200ch is sweet spot
    b[1] <- r * runif(1, 0.30, 0.45); b[2] <- r * runif(1, 0.88, 0.95); b[3] <- r
  } else if (tid == 5) {
    # Gradual increase to 300
    b[1] <- r * runif(1, 0.25, 0.40); b[2] <- r * runif(1, 0.55, 0.70); b[3] <- r
  } else {
    b[1] <- r * runif(1, 0.20, 0.35); b[2] <- r * runif(1, 0.50, 0.65); b[3] <- r
  }

  # Movie (4-5): mv_HBO, mv_HBOST
  r <- ranges[2]
  b[4] <- r * runif(1, 0.30, 0.55); b[5] <- r

  # DVR (6-7): dvr_SD, dvr_HD
  r <- ranges[3]
  b[6] <- r * runif(1, 0.30, 0.60); b[7] <- r

  # Price (8-12): pr_60..pr_200 (negative)
  r <- ranges[4]
  if (tid == 1) {
    b[8]  <- -r * runif(1, 0.18, 0.25)
    b[9]  <- -r * runif(1, 0.38, 0.48)
    b[10] <- -r * runif(1, 0.56, 0.66)
    b[11] <- -r * runif(1, 0.74, 0.84)
    b[12] <- -r
  } else if (tid == 2) {
    b[8]  <- -r * runif(1, 0.12, 0.20)
    b[9]  <- -r * runif(1, 0.32, 0.42)
    b[10] <- -r * runif(1, 0.52, 0.62)
    b[11] <- -r * runif(1, 0.72, 0.82)
    b[12] <- -r
  } else if (tid <= 5) {
    b[8]  <- -r * runif(1, 0.10, 0.18)
    b[9]  <- -r * runif(1, 0.28, 0.38)
    b[10] <- -r * runif(1, 0.48, 0.58)
    b[11] <- -r * runif(1, 0.68, 0.78)
    b[12] <- -r
  } else {
    b[8]  <- -r * runif(1, 0.08, 0.15)
    b[9]  <- -r * runif(1, 0.22, 0.32)
    b[10] <- -r * runif(1, 0.40, 0.52)
    b[11] <- -r * runif(1, 0.60, 0.72)
    b[12] <- -r
  }

  # Internet (13-14): int_100, int_300
  r <- ranges[5]
  if (tid == 1) {
    b[13] <- r * runif(1, 0.92, 0.97); b[14] <- r
  } else {
    b[13] <- r * runif(1, 0.30, 0.45); b[14] <- r
  }

  # Phone (15-16): ph_200min, ph_unlimited
  r <- ranges[6]
  b[15] <- r * runif(1, 0.30, 0.60); b[16] <- r

  b
}

# --- 5. Generate respondents with first-choice verification ---
cat("\n--- Generating respondents ---\n")
n_total <- sum(type_sizes)
ratings_matrix <- matrix(0, nrow = n_profiles, ncol = n_total)
betas_ols_all  <- matrix(0, nrow = n_dummies + 1, ncol = n_total)
r_sq_vec <- numeric(n_total)
type_labels <- integer(n_total)

col <- 0
for (tid in 1:6) {
  n_att_total <- 0
  for (i in 1:type_sizes[tid]) {
    col <- col + 1
    matched <- FALSE

    for (attempt in 1:500) {
      betas <- generate_betas(type_targets[[tid]], tid)
      intercept <- -betas[12]   # worst profile → rating ≈ 0

      y_pred <- as.numeric(X %*% betas) + intercept
      y_noisy <- y_pred + rnorm(n_profiles, 0, noise_sd)
      y_final <- round(pmin(pmax(y_noisy, 1), 100))

      b_ols <- as.numeric(M %*% y_final)

      # Check first-choice product from OLS betas
      mkt_utils <- as.numeric(market_aug %*% b_ols)
      first_choice <- which.max(mkt_utils)

      if (first_choice == tid) {
        matched <- TRUE
        n_att_total <- n_att_total + attempt
        break
      }
    }

    if (!matched) {
      cat(sprintf("  WARNING: Type %d resp %d didn't match (got prod %d)\n", tid, i, first_choice))
      n_att_total <- n_att_total + 500
    }

    y_hat <- as.numeric(X_aug %*% b_ols)
    ss_res <- sum((y_final - y_hat)^2)
    ss_tot <- sum((y_final - mean(y_final))^2)

    ratings_matrix[, col] <- y_final
    betas_ols_all[, col]  <- b_ols
    r_sq_vec[col] <- 1 - ss_res / ss_tot
    type_labels[col] <- tid
  }
  avg_att <- n_att_total / type_sizes[tid]
  cat(sprintf("  Type %d → %-18s: %2d respondents, avg %.1f attempts\n",
              tid, prod_names[tid], type_sizes[tid], avg_att))
}

# --- 6. Shuffle and write ---
shuf <- sample(n_total)
ratings_shuf <- ratings_matrix[, shuf]
betas_shuf   <- betas_ols_all[, shuf]
r_sq_shuf    <- r_sq_vec[shuf]
type_shuf    <- type_labels[shuf]

df <- data.frame(Profile = 1:n_profiles, ratings_shuf)
colnames(df) <- c("Profile", paste0("Respondent_", 1:n_total))
write.csv(df, "conjoint_ratings.csv", row.names = FALSE)
cat(sprintf("\nWrote conjoint_ratings.csv: %d profiles x %d respondents\n", n_profiles, n_total))
cat("Rating range:", min(ratings_shuf), "-", max(ratings_shuf),
    "  mean:", round(mean(ratings_shuf), 1), "\n")

# --- 7. Verification ---
cat("\n--- Verification ---\n")
cat(sprintf("R² -- min: %.3f  mean: %.3f  max: %.3f\n",
            min(r_sq_shuf), mean(r_sq_shuf), max(r_sq_shuf)))

# Average part-worths
avg_b <- rowMeans(betas_shuf)
dummy_names <- colnames(X)
cat("\nAverage part-worth utilities (OLS):\n")
cat("  Intercept:", round(avg_b[1], 2), "\n")
for (j in 1:n_dummies) cat(sprintf("  %-42s %+.2f\n", dummy_names[j], avg_b[j+1]))

# Monotonicity
b <- avg_b[-1]
cat("\nMonotonicity:\n")
cat("  Ch:  ", round(b[1],1), "<", round(b[2],1), "<", round(b[3],1), "?", b[1]<b[2] && b[2]<b[3], "\n")
cat("  Mv:  ", round(b[4],1), "<", round(b[5],1), "?", b[4]<b[5], "\n")
cat("  DVR: ", round(b[6],1), "<", round(b[7],1), "?", b[6]<b[7], "\n")
cat("  Pr:  ", round(b[8],1), ">", round(b[9],1), ">", round(b[10],1), ">", round(b[11],1), ">", round(b[12],1),
    "?", b[8]>b[9] && b[9]>b[10] && b[10]>b[11] && b[11]>b[12], "\n")
cat("  Int: ", round(b[13],1), "<", round(b[14],1), "?", b[13]<b[14], "\n")
cat("  Ph:  ", round(b[15],1), "<", round(b[16],1), "?", b[15]<b[16], "\n")

# Per-type average importances
cat("\n--- Per-Type Average Importances ---\n")
attr_names <- c("Ch","Mv","DVR","Pr","Int","Ph")
pw <- betas_shuf[-1, ]
ch_r <- pmax(0,pw[1,],pw[2,],pw[3,]) - pmin(0,pw[1,],pw[2,],pw[3,])
mv_r <- pmax(0,pw[4,],pw[5,]) - pmin(0,pw[4,],pw[5,])
dv_r <- pmax(0,pw[6,],pw[7,]) - pmin(0,pw[6,],pw[7,])
pr_r <- pmax(0,pw[8,],pw[9,],pw[10,],pw[11,],pw[12,]) -
        pmin(0,pw[8,],pw[9,],pw[10,],pw[11,],pw[12,])
in_r <- pmax(0,pw[13,],pw[14,]) - pmin(0,pw[13,],pw[14,])
ph_r <- pmax(0,pw[15,],pw[16,]) - pmin(0,pw[15,],pw[16,])
tot <- ch_r + mv_r + dv_r + pr_r + in_r + ph_r
imp_all <- rbind(ch_r, mv_r, dv_r, pr_r, in_r, ph_r) / rep(tot, each=6) * 100

for (tid in 1:6) {
  idx <- which(type_shuf == tid)
  seg_imp <- rowMeans(imp_all[, idx, drop=FALSE])
  cat(sprintf("  Type %d → %-18s (%2d): Ch=%.0f%% Mv=%.0f%% DVR=%.0f%% Pr=%.0f%% Int=%.0f%% Ph=%.0f%%\n",
              tid, prod_names[tid], length(idx),
              seg_imp[1], seg_imp[2], seg_imp[3], seg_imp[4], seg_imp[5], seg_imp[6]))
}

# Market shares (first-choice)
cat("\n--- Market Shares (First-Choice) ---\n")
all_utils <- market_aug %*% betas_shuf
choices <- apply(all_utils, 2, which.max)
shares <- table(factor(choices, levels=1:6)) / n_total * 100
for (p in 1:6) cat(sprintf("  %-25s %5.1f%%\n", prod_names[p], shares[p]))

# Segmentation (20% threshold) for reference
cat("\n--- Recovered Segments (20% threshold) ---\n")
recover_label <- function(b_ols) {
  pw <- b_ols[-1]
  full_names <- c("Channels","Movie","DVR","Price","Internet","Phone")
  ranges <- c(
    max(0,pw[1],pw[2],pw[3]) - min(0,pw[1],pw[2],pw[3]),
    max(0,pw[4],pw[5]) - min(0,pw[4],pw[5]),
    max(0,pw[6],pw[7]) - min(0,pw[6],pw[7]),
    max(0,pw[8],pw[9],pw[10],pw[11],pw[12]) - min(0,pw[8],pw[9],pw[10],pw[11],pw[12]),
    max(0,pw[13],pw[14]) - min(0,pw[13],pw[14]),
    max(0,pw[15],pw[16]) - min(0,pw[15],pw[16])
  )
  imp <- ranges / sum(ranges) * 100
  paste(full_names[imp >= 20], collapse=", ")
}
seg_labels <- sapply(1:n_total, function(i) recover_label(betas_shuf[,i]))
seg_tab <- sort(table(seg_labels), decreasing=TRUE)
for (i in seq_along(seg_tab)) {
  cat(sprintf("  %-50s %3d (%.0f%%)\n", names(seg_tab)[i], seg_tab[i], seg_tab[i]/n_total*100))
}
