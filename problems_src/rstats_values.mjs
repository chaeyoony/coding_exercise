export default {
 "cols_with_na(health)": [
  "waist",
  "fbs",
  "chol",
  "miss_t"
 ],
 "na_rate(health, \"chol\")": 0.693,
 "na_rate(health, \"fbs\")": 0.02,
 "complete_count(health)": 582,
 "complete_count(health_clean)": 576,
 "valid_count(health)": 576,
 "valid_count(health_clean)": 576,
 "draw_sample(health_clean, 5)$id": [
  301,
  581,
  110,
  167,
  179
 ],
 "nrow(prepare(health))": 576,
 "as.integer(table(prepare(health)$gender))": [
  377,
  199
 ],
 "as.integer(table(prepare(health)$age_group))": [
  151,
  175,
  250
 ],
 "round(mean(prepare(health)$bmi), 3)": 24.676,
 "names(prepare(health))": [
  "id",
  "sido",
  "gender",
  "age",
  "height",
  "weight",
  "waist",
  "sbp",
  "dbp",
  "fbs",
  "ggt",
  "smoke",
  "drink",
  "bmi",
  "age_group"
 ],
 "as.numeric(group_means(health_clean))": [
  106.72,
  111.11
 ],
 "ci_manual(health_clean$sbp)": [
  108.52,
  110.67
 ],
 "ci_manual(c(1, 2, 3, 4, 5, 6, 7, 8, 9, 10))": [
  3.33,
  7.67
 ],
 "ci_ttest(health_clean$sbp)": [
  108.52,
  110.67
 ],
 "ci_width(health_clean$sbp)": 2.15,
 "ci_diff(health_clean$weight, health_clean$gender)": [
  -11.31,
  -7.88
 ],
 "ci_diff(health_clean$sbp, health_clean$drink)": [
  -1.54,
  2.77
 ],
 "mean_diff(health_clean$weight, health_clean$gender)": -9.59,
 "mean_diff(health_clean$ggt, health_clean$drink)": 21.78,
 "welch_p(health_clean$weight, health_clean$gender)": true,
 "welch_p(health_clean$ggt, health_clean$drink)": true,
 "ggt_report(health_clean)": {
  "non": 24.38,
  "drink": 46.16,
  "significant": true
 },
 "ggt_report(health_clean)$significant": true,
 "ggt_report(health_clean)$drink > ggt_report(health_clean)$non": true,
 "cohens_d(health_clean$weight[health_clean$gender == \"Male\"], health_clean$weight[health_clean$gender == \"Female\"])": 0.916,
 "f_manual(health_clean$sbp, health_clean$age_group)": 115.38,
 "round(summary(aov(sbp ~ age_group, data = health_clean))[[1]][[\"F value\"]][1], 3)": 115.38,
 "anova_f(health_clean)": 115.38,
 "anova_significant(health_clean)": true,
 "tukey_diffs(health_clean)": [
  7.75,
  -9.56,
  -17.32
 ],
 "all_pairs_significant(health_clean)": true,
 "cor_hw(health_clean)": 0.558,
 "r_squared_cor(health_clean$height, health_clean$weight)": 0.311,
 "cor_significant(health_clean$height, health_clean$weight)": true,
 "cor_significant(health_clean$sbp, health_clean$dbp)": true,
 "high_cor_pairs(health_clean, c(\"height\", \"weight\", \"waist\", \"bmi\", \"sbp\", \"dbp\"), 0.8)": "waist-bmi",
 "high_cor_pairs(health_clean, c(\"sbp\", \"dbp\"), 0.1)": "sbp-dbp",
 "cor_row(health_clean, c(\"height\", \"weight\", \"bmi\"), \"weight\")": [
  0.558,
  1,
  0.774
 ],
 "fit_simple(health_clean)": [
  69.707,
  1.616
 ],
 "predict_sbp(health_clean, 25)": 110.1,
 "predict_sbp(health_clean, c(20, 30))": [
  102,
  118.2
 ],
 "r2_model(health_clean)": 0.1707,
 "female_effect(health_clean)": 4.39,
 "male_effect_ref_male(health_clean)": -4.39,
 "multi_coef(health_clean)": [
  58.892,
  1.595,
  0.429
 ],
 "multi_coef(data.frame(sbp = c(10, 20, 30, 40), age = c(1, 2, 3, 4), waist = c(2, 1, 4, 3)))": [
  0,
  10,
  0
 ],
 "multi_coef(data.frame(sbp = c(3, 5, 7, 9), age = 1:4, waist = c(0, 0, 0, 0) + c(1, 3, 2, 5)))": [
  1,
  2,
  0
 ],
 "compare_models(health_clean)": true,
 "round(anova(lm(sbp ~ age, data = health_clean), lm(sbp ~ age + waist + gender, data = health_clean))[[\"F\"]][2], 2)": 67.4,
 "residual_check(health_clean)$sse": 82102.5,
 "max_cook(health_clean)$id": 82,
 "max_cook(health_clean)$cook": 0.027,
 "reg_report(health_clean)$r2": 0.4416,
 "reg_report(health_clean)$waist_slope": 0.412,
 "reg_report(health_clean)$waist_sig": true
};
