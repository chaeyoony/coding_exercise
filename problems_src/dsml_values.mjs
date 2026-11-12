export default {
 "sk_linear([[1, 1], [2, 1], [3, 2]], [4, 6, 11], [4, 3])": 16,
 "sk_cv_mean([[i] for i in range(12)], [0] * 6 + [1] * 6, 3)": 0.8333,
 "sk_cv_mean([[i] for i in range(20)], [0] * 10 + [1] * 10, 5)": 0.9,
 "sk_cv_mean([[i, 2 * i] for i in range(12)], [0] * 6 + [1] * 6, 2)": 0.75,
 "bootstrap_indices(5, 0)": [
  4,
  3,
  2,
  1,
  1
 ],
 "recommend({\"a\": [5, 0, 0], \"b\": [5, 4, 1], \"c\": [5, 1, 4]}, \"a\", 2)": [
  1,
  2
 ]
};
