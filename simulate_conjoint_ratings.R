# ============================================================
# Simulate Conjoint Ratings Data
# ============================================================
# Generates realistic conjoint ratings for 64 respondents
# across 4 latent segments with monotonic utility patterns:
#   Channels:  50 < 100 < 200 < 300
#   Movie:     None < HBO < HBO+ShowTime
#   DVR:       None < SD DVR < HD DVR
#   Price:     $30 > $60 > $90 > $120 > $150 > $200
#   Internet:  None < 100 Mbps < 300 Mbps
#   Phone:     None < 200 Mins < Unlimited
# ============================================================

set.seed(42)

# --- 1. Read the dummy-coded design matrix ---
design <- read.csv("conjoint_design.csv")
X <- as.matrix(design[, -1])  # drop Profile column
n_profiles <- nrow(X)
n_dummies  <- ncol(X)

cat("Design matrix:", n_profiles, "profiles x", n_dummies, "dummies\n")

# --- 2. Define segment-level part-worth utilities ---
# Column order:
#   Ch_100, Ch_200, Ch_300,
#   Mov_HBO, Mov_HBO+ST,
#   DVR_SD, DVR_HD,
#   Pr_60, Pr_90, Pr_120, Pr_150, Pr_200,
#   Int_100, Int_300,
#   Ph_200, Ph_Unl

# Segment 1: "Price Sensitive" — Price dominates (~71%)
seg1 <- c(2, 4.5, 7,       # Channels (mild ↑)
          1, 2,             # Movie (indifferent)
          0.5, 1,           # DVR (indifferent)
          -6, -12, -20, -27, -35,  # Price (strong ↓)
          1.5, 3,           # Internet (mild)
          0.5, 1)           # Phone (indifferent)

# Segment 2: "Value Seeker" — Channels (~38%) + Price (~41%)
seg2 <- c(7, 15, 24,       # Channels (strong ↑)
          2, 4,             # Movie (mild)
          1.5, 3,           # DVR (mild)
          -5, -10, -15, -20, -26,  # Price (strong ↓)
          2, 4,             # Internet (mild)
          1, 2)             # Phone (mild)

# Segment 3: "Entertainment Lover" — Channels (~34%) + Movie (~32%)
seg3 <- c(6, 13, 20,       # Channels (strong ↑)
          10, 19,           # Movie (strong ↑)
          5, 10,            # DVR (moderate ↑)
          -1, -2, -3.5, -5, -7,   # Price (low sensitivity)
          1, 2,             # Internet (indifferent)
          0.5, 1)           # Phone (indifferent)

# Segment 4: "Tech Focused" — Internet (~37%) + Price (~31%)
seg4 <- c(2, 3, 5,         # Channels (mild ↑)
          1, 2,             # Movie (indifferent)
          2, 4,             # DVR (mild)
          -3, -6, -10, -14, -18,  # Price (moderate ↓)
          9, 22,            # Internet (strong ↑)
          3, 8)             # Phone (moderate ↑)

segment_betas <- list(seg1, seg2, seg3, seg4)
segment_names <- c("Price Sensitive", "Value Seeker",
                    "Entertainment Lover", "Tech Focused")

# --- 3. Simulation parameters ---
n_per_segment <- 16
n_respondents <- n_per_segment * length(segment_betas)
intercept     <- 50
noise_sd      <- 8    # observation noise standard deviation

# --- 4. Generate ratings ---
ratings_matrix <- matrix(0, nrow = n_profiles, ncol = n_respondents)

for (seg_idx in seq_along(segment_betas)) {
  seg_beta <- segment_betas[[seg_idx]]

  for (i in 1:n_per_segment) {
    resp_idx <- (seg_idx - 1) * n_per_segment + i

    # Individual variation: scale each coefficient by (1 + noise)
    # Stronger preferences get less noise (±10%), weaker get more (±20%)
    noise_scale <- ifelse(abs(seg_beta) > 4, 0.10, 0.20)
    beta_i <- seg_beta * (1 + rnorm(n_dummies, 0, noise_scale))

    # Enforce monotonicity within each attribute
    beta_i[1:3]   <-  sort(abs(beta_i[1:3]))           # Channels ↑
    beta_i[4:5]   <-  sort(abs(beta_i[4:5]))           # Movie ↑
    beta_i[6:7]   <-  sort(abs(beta_i[6:7]))           # DVR ↑
    beta_i[8:12]  <- -sort(abs(beta_i[8:12]))           # Price ↓
    beta_i[13:14] <-  sort(abs(beta_i[13:14]))          # Internet ↑
    beta_i[15:16] <-  sort(abs(beta_i[15:16]))          # Phone ↑

    # Generate ratings: y = intercept + X %*% beta + noise
    y <- intercept + as.numeric(X %*% beta_i) + rnorm(n_profiles, 0, noise_sd)
    y <- round(y)
    y <- pmin(pmax(y, 1), 100)   # clip to [1, 100]

    ratings_matrix[, resp_idx] <- y
  }
}

# --- 5. Build and write the ratings data frame ---
ratings_df <- data.frame(
  Profile = 1:n_profiles,
  ratings_matrix
)
colnames(ratings_df) <- c("Profile",
                           paste0("Respondent_", 1:n_respondents))

write.csv(ratings_df, "conjoint_ratings.csv", row.names = FALSE)

cat("Wrote conjoint_ratings.csv:",
    n_profiles, "profiles x", n_respondents, "respondents\n")
cat("Rating range:", min(ratings_matrix), "-", max(ratings_matrix),
    "  mean:", round(mean(ratings_matrix), 1), "\n")

# --- 6. Quick verification ---
cat("\n--- Verification ---\n")

# OLS for each respondent
X_ols <- cbind(1, X)  # prepend intercept column
ols_betas <- matrix(0, nrow = n_respondents, ncol = n_dummies + 1)
r_squared  <- numeric(n_respondents)

for (r in 1:n_respondents) {
  y <- ratings_matrix[, r]
  fit <- lm(y ~ X)
  ols_betas[r, ] <- coef(fit)
  r_squared[r]   <- summary(fit)$r.squared
}

cat("R² — min:", round(min(r_squared), 3),
    " mean:", round(mean(r_squared), 3),
    " max:", round(max(r_squared), 3), "\n")

# Average betas (check monotonicity)
avg_beta <- colMeans(ols_betas)
dummy_names <- colnames(X)

cat("\nAverage part-worth utilities:\n")
cat("  Intercept:", round(avg_beta[1], 2), "\n")
for (j in 1:n_dummies) {
  cat(sprintf("  %-40s %+.2f\n", dummy_names[j], avg_beta[j + 1]))
}

# Monotonicity checks
cat("\nMonotonicity:\n")
b <- avg_beta[-1]  # drop intercept
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
