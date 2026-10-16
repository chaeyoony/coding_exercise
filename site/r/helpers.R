.esc <- function(s) {
  s <- gsub("\\", "\\\\", s, fixed = TRUE)
  s <- gsub("\"", "\\\"", s, fixed = TRUE)
  s <- gsub("\n", "\\n", s, fixed = TRUE)
  s <- gsub("\r", "\\r", s, fixed = TRUE)
  s <- gsub("\t", "\\t", s, fixed = TRUE)
  paste0("\"", s, "\"")
}

.cell <- function(x) {
  if (length(x) == 0) return("null")
  x <- x[[1]]
  if (is.na(x)) return("null")
  if (is.logical(x)) return(if (x) "true" else "false")
  if (is.numeric(x)) {
    if (!is.finite(x)) return("null")
    return(sprintf("%.12g", x))
  }
  .esc(as.character(x))
}

.val <- function(x) {
  if (is.null(x)) return("null")
  if (is.factor(x)) x <- as.character(x)
  if (is.data.frame(x)) x <- as.list(x)
  if (is.list(x)) {
    items <- vapply(x, .val, "")
    if (!is.null(names(x)) && all(names(x) != "")) {
      return(paste0("{", paste(paste0(vapply(names(x), .esc, ""), ":", items), collapse = ","), "}"))
    }
    return(paste0("[", paste(items, collapse = ","), "]"))
  }
  if (length(x) == 1) return(.cell(x))
  paste0("[", paste(vapply(seq_along(x), function(i) .cell(x[i]), ""), collapse = ","), "]")
}

.table <- function(x) {
  if (inherits(x, "table")) x <- as.data.frame(x, stringsAsFactors = FALSE)
  if (is.matrix(x)) x <- as.data.frame(x, stringsAsFactors = FALSE)
  if (!is.data.frame(x)) {
    if (!is.null(names(x))) {
      x <- data.frame(name = names(x), value = unname(x), stringsAsFactors = FALSE)
    } else {
      x <- data.frame(value = x, stringsAsFactors = FALSE)
    }
  }
  cols <- names(x)
  n <- nrow(x)
  rows <- vapply(seq_len(n), function(i) {
    paste0("[", paste(vapply(seq_along(cols), function(j) .cell(x[[j]][i]), ""), collapse = ","), "]")
  }, "")
  paste0("{\"columns\":[", paste(vapply(cols, .esc, ""), collapse = ","),
         "],\"rows\":[", paste(rows, collapse = ","), "]}")
}

.errmsg <- function(e) {
  call <- conditionCall(e)
  msg <- conditionMessage(e)
  if (!is.null(call)) paste0(msg, "  (", paste(deparse(call)[1], collapse = ""), " 에서)") else msg
}

.reset <- function(datadir) {
  env <- new.env(parent = globalenv())
  for (f in list.files(datadir, pattern = "\\.csv$", full.names = TRUE)) {
    nm <- sub("\\.csv$", "", basename(f))
    assign(nm, read.csv(f, stringsAsFactors = FALSE, na.strings = c("", "NA")), envir = env)
  }
  assign(".env", env, envir = globalenv())
}

.run_user <- function(file) {
  env <- get(".env", envir = globalenv())
  code <- paste(readLines(file, warn = FALSE, encoding = "UTF-8"), collapse = "\n")
  err <- NULL
  warns <- character(0)
  out <- capture.output({
    withCallingHandlers(
      tryCatch({
        exprs <- parse(text = code, keep.source = FALSE)
        for (e in exprs) {
          r <- withVisible(eval(e, env))
          if (r$visible) print(r$value)
        }
      }, error = function(e) err <<- .errmsg(e)),
      warning = function(w) {
        warns <<- c(warns, conditionMessage(w))
        invokeRestart("muffleWarning")
      })
  })
  if (length(warns)) out <- c(out, paste0("경고: ", unique(warns)))
  list(stdout = paste(out, collapse = "\n"), error = err)
}

.pack <- function(r, extra = "") {
  paste0("{\"stdout\":", .esc(r$stdout), ",\"error\":",
         if (is.null(r$error)) "null" else .esc(r$error), extra, "}")
}

.run_table <- function(datadir, file) {
  .reset(datadir)
  r <- .run_user(file)
  if (!is.null(r$error)) return(.pack(r))
  env <- get(".env", envir = globalenv())
  if (!exists("result", envir = env, inherits = FALSE)) {
    r$error <- "result 라는 이름의 변수에 정답을 담아 주세요. 예: result <- ..."
    return(.pack(r))
  }
  tbl <- tryCatch(.table(get("result", envir = env)), error = function(e) NULL)
  if (is.null(tbl)) {
    r$error <- "result 를 표로 바꾸지 못했습니다."
    return(.pack(r))
  }
  .pack(r, paste0(",\"table\":", tbl))
}

.run_tests <- function(datadir, file, callsfile) {
  .reset(datadir)
  r <- .run_user(file)
  if (!is.null(r$error)) return(.pack(r))
  env <- get(".env", envir = globalenv())
  calls <- readLines(callsfile, warn = FALSE, encoding = "UTF-8")
  items <- vapply(calls, function(cl) {
    res <- tryCatch({
      v <- eval(parse(text = cl, keep.source = FALSE)[[1]], env)
      paste0("{\"ok\":true,\"value\":", .val(v), "}")
    }, error = function(e) paste0("{\"ok\":false,\"error\":", .esc(.errmsg(e)), "}"))
    res
  }, "", USE.NAMES = FALSE)
  .pack(r, paste0(",\"results\":[", paste(items, collapse = ","), "]"))
}
