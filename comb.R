setwd("/Users/ziyuanhan/Desktop")
library(stats4)
comb <- read.csv("comb.csv",fill = TRUE,na.strings = c(""),header = TRUE)
# par(mfrow=c(2,1))

chinese.rate <- as.numeric(comb$rate[which(comb$title=="chinese")])
chinese.score <- as.numeric(comb$score[which(comb$title=="chinese")])
# hist(chinese.rate,freq=FALSE, main = "chinese" , xlab = "rating")
# hist(chinese.score,freq=FALSE, main = "chinese" , xlab = "score")

minuslogl.gam.rate <- function(theta, kappa) {
  y <- dgamma(chinese.rate, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.gam.score <- function(theta, kappa) {
  y <- dgamma(chinese.score, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.wei.rate <- function(yita, beta) {
  y <- suppressWarnings(dweibull(chinese.rate, shape = yita, scale = beta))
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.wei.score <- function(yita, beta) {
  y <- suppressWarnings(dweibull(chinese.score, shape = yita, scale = beta))
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

c <- chinese.score
n <- length(c)
kappa.mme <- (n*mean(c)^2) / ((n-1)*var(c))
theta.mme <- ((n-1)*var(c)) / (n*mean(c))
fit.gam.score <- mle(minuslogl.gam.score, start = list(theta = theta.mme, kappa = kappa.mme))
summary(fit.gam.score)
theta.mle <- fit.gam.score@coef[1]
kappa.mle <- fit.gam.score@coef[2]

fit.wei.score <- mle(minuslogl.wei.score, start = list(yita = 1, beta = 1))
summary(fit.wei.score)
yita.mle <- fit.wei.score@coef[1]
beta.mle <- fit.wei.score@coef[2]
hist(c,freq=FALSE, main = "chinese" , xlab = "score")
curve(dweibull(x,shape=yita.mle,scale =beta.mle),from=0,to=100,col="blue",lwd=2,add=TRUE)
curve(dgamma(x,shape=kappa.mle,scale = theta.mle),from=0,to=100,col="red",lwd=2,add=TRUE)
legend("topleft",legend=c("gamma","weibull"),col=c("red","blue"),lwd=2)

c <- chinese.rate
n <- length(c)
kappa.mme <- (n*mean(c)^2) / ((n-1)*var(c))
theta.mme <- ((n-1)*var(c)) / (n*mean(c))
fit.gam.rate <- mle(minuslogl.gam.rate, start = list(theta = theta.mme, kappa = kappa.mme))
summary(fit.gam.score)
theta.mle <- fit.gam.rate@coef[1]
kappa.mle <- fit.gam.rate@coef[2]

fit.wei.rate <- mle(minuslogl.wei.rate, start = list(yita = 1, beta = 1))
summary(fit.wei.rate)
yita.mle <- fit.wei.rate@coef[1]
beta.mle <- fit.wei.rate@coef[2]
hist(c,freq=FALSE, main = "chinese" , xlab = "rate")
curve(dgamma(x,shape=kappa.mle,scale = theta.mle),from=1,to=5,col="red",lwd=2,add=TRUE)
curve(dweibull(x,shape=yita.mle,scale =beta.mle),from=1,to=5,col="blue",lwd=2,add=TRUE)
legend("topleft",legend=c("gamma","weibull"),col=c("red","blue"),lwd=2)





american.rate <- comb$rate[which(comb$title=="american")]
american.score <- comb$score[which(comb$title=="american")]
# hist(american.rate,freq=FALSE, main = "american" , xlab = "rating")
# hist(american.score,freq=FALSE, main = "american" , xlab = "score")

minuslogl.gam.rate <- function(theta, kappa) {
  y <- dgamma(american.rate, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.gam.score <- function(theta, kappa) {
  y <- dgamma(american.score, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.wei.rate <- function(yita, beta) {
  y <- suppressWarnings(dweibull(american.rate, shape = yita, scale = beta))
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.wei.score <- function(yita, beta) {
  y <- suppressWarnings(dweibull(american.score, shape = yita, scale = beta))
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

c <- american.score
n <- length(c)
kappa.mme <- (n*mean(c)^2) / ((n-1)*var(c))
theta.mme <- ((n-1)*var(c)) / (n*mean(c))
fit.gam.score <- mle(minuslogl.gam.score, start = list(theta = theta.mme, kappa = kappa.mme))
summary(fit.gam.score)
theta.mle <- fit.gam.score@coef[1]
kappa.mle <- fit.gam.score@coef[2]

fit.wei.score <- mle(minuslogl.wei.score, start = list(yita = 1, beta = 1))
summary(fit.wei.score)
yita.mle <- fit.wei.score@coef[1]
beta.mle <- fit.wei.score@coef[2]
hist(c,freq=FALSE, main = "american" , xlab = "score")
curve(dweibull(x,shape=yita.mle,scale =beta.mle),from=0,to=100,col="blue",lwd=2,add=TRUE)
curve(dgamma(x,shape=kappa.mle,scale = theta.mle),from=0,to=100,col="red",lwd=2,add=TRUE)
legend("topleft",legend=c("gamma","weibull"),col=c("red","blue"),lwd=2)

c <- american.rate
n <- length(c)
kappa.mme <- (n*mean(c)^2) / ((n-1)*var(c))
theta.mme <- ((n-1)*var(c)) / (n*mean(c))
fit.gam.rate <- mle(minuslogl.gam.rate, start = list(theta = theta.mme, kappa = kappa.mme))
summary(fit.gam.score)
theta.mle <- fit.gam.rate@coef[1]
kappa.mle <- fit.gam.rate@coef[2]

fit.wei.rate <- mle(minuslogl.wei.rate, start = list(yita = 1, beta = 1))
summary(fit.wei.rate)
yita.mle <- fit.wei.rate@coef[1]
beta.mle <- fit.wei.rate@coef[2]
hist(c,freq=FALSE, main = "american" , xlab = "rate")
curve(dgamma(x,shape=kappa.mle,scale = theta.mle),from=1,to=5,col="red",lwd=2,add=TRUE)
curve(dweibull(x,shape=yita.mle,scale =beta.mle),from=1,to=5,col="blue",lwd=2,add=TRUE)
legend("topleft",legend=c("gamma","weibull"),col=c("red","blue"),lwd=2)







japan.rate <- as.numeric(comb$rate[which(comb$title=="japanese")])
japan.score <- as.numeric(comb$score[which(comb$title=="japanese")])
# hist(japan.rate,freq=FALSE, main = "japanese" , xlab = "rating")
# hist(japan.score,freq=FALSE, main = "japanese" , xlab = "score")

minuslogl.gam.rate <- function(theta, kappa) {
  y <- dgamma(japan.rate, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.gam.score <- function(theta, kappa) {
  y <- dgamma(japan.score, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.wei.rate <- function(yita, beta) {
  y <- suppressWarnings(dweibull(japan.rate, shape = yita, scale = beta))
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.wei.score <- function(yita, beta) {
  y <- suppressWarnings(dweibull(japan.score, shape = yita, scale = beta))
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

c <- japan.score
n <- length(c)
kappa.mme <- (n*mean(c)^2) / ((n-1)*var(c))
theta.mme <- ((n-1)*var(c)) / (n*mean(c))
fit.gam.score <- mle(minuslogl.gam.score, start = list(theta = theta.mme, kappa = kappa.mme))
summary(fit.gam.score)
theta.mle <- fit.gam.score@coef[1]
kappa.mle <- fit.gam.score@coef[2]

fit.wei.score <- mle(minuslogl.wei.score, start = list(yita = 1, beta = 1))
summary(fit.wei.score)
yita.mle <- fit.wei.score@coef[1]
beta.mle <- fit.wei.score@coef[2]
hist(c,freq=FALSE, main = "japan" , xlab = "score")
curve(dweibull(x,shape=yita.mle,scale =beta.mle),from=0,to=100,col="blue",lwd=2,add=TRUE)
curve(dgamma(x,shape=kappa.mle,scale = theta.mle),from=0,to=100,col="red",lwd=2,add=TRUE)
legend("topleft",legend=c("gamma","weibull"),col=c("red","blue"),lwd=2)

c <- japan.rate
n <- length(c)
kappa.mme <- (n*mean(c)^2) / ((n-1)*var(c))
theta.mme <- ((n-1)*var(c)) / (n*mean(c))
fit.gam.rate <- mle(minuslogl.gam.rate, start = list(theta = theta.mme, kappa = kappa.mme))
summary(fit.gam.score)
theta.mle <- fit.gam.rate@coef[1]
kappa.mle <- fit.gam.rate@coef[2]

fit.wei.rate <- mle(minuslogl.wei.rate, start = list(yita = 1, beta = 1))
summary(fit.wei.rate)
yita.mle <- fit.wei.rate@coef[1]
beta.mle <- fit.wei.rate@coef[2]
hist(c,freq=FALSE, main = "japan" , xlab = "rate")
curve(dgamma(x,shape=kappa.mle,scale = theta.mle),from=1,to=5,col="red",lwd=2,add=TRUE)
curve(dweibull(x,shape=yita.mle,scale =beta.mle),from=1,to=5,col="blue",lwd=2,add=TRUE)
legend("topleft",legend=c("gamma","weibull"),col=c("red","blue"),lwd=2)







korean.rate <- as.numeric(comb$rate[which(comb$title=="korean")])
korean.score <- as.numeric(comb$score[which(comb$title=="korean")])
# hist(korean.rate,freq=FALSE, main = "korean" , xlab = "rating")
# hist(korean.score,freq=FALSE, main = "korean" , xlab = "score")

minuslogl.gam.rate <- function(theta, kappa) {
  y <- dgamma(korean.rate, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.gam.score <- function(theta, kappa) {
  y <- dgamma(korean.score, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.wei.rate <- function(yita, beta) {
  y <- suppressWarnings(dweibull(korean.rate, shape = yita, scale = beta))
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.wei.score <- function(yita, beta) {
  y <- suppressWarnings(dweibull(korean.score, shape = yita, scale = beta))
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

c <- korean.score
n <- length(c)
kappa.mme <- (n*mean(c)^2) / ((n-1)*var(c))
theta.mme <- ((n-1)*var(c)) / (n*mean(c))
fit.gam.score <- mle(minuslogl.gam.score, start = list(theta = theta.mme, kappa = kappa.mme))
summary(fit.gam.score)
theta.mle <- fit.gam.score@coef[1]
kappa.mle <- fit.gam.score@coef[2]

fit.wei.score <- mle(minuslogl.wei.score, start = list(yita = 1, beta = 1))
summary(fit.wei.score)
yita.mle <- fit.wei.score@coef[1]
beta.mle <- fit.wei.score@coef[2]
hist(c,freq=FALSE, main = "korean" , xlab = "score")
curve(dweibull(x,shape=yita.mle,scale =beta.mle),from=0,to=100,col="blue",lwd=2,add=TRUE)
curve(dgamma(x,shape=kappa.mle,scale = theta.mle),from=0,to=100,col="red",lwd=2,add=TRUE)
legend("topleft",legend=c("gamma","weibull"),col=c("red","blue"),lwd=2)

c <- korean.rate
n <- length(c)
kappa.mme <- (n*mean(c)^2) / ((n-1)*var(c))
theta.mme <- ((n-1)*var(c)) / (n*mean(c))
fit.gam.rate <- mle(minuslogl.gam.rate, start = list(theta = theta.mme, kappa = kappa.mme))
summary(fit.gam.score)
theta.mle <- fit.gam.rate@coef[1]
kappa.mle <- fit.gam.rate@coef[2]

fit.wei.rate <- mle(minuslogl.wei.rate, start = list(yita = 1, beta = 1))
summary(fit.wei.rate)
yita.mle <- fit.wei.rate@coef[1]
beta.mle <- fit.wei.rate@coef[2]
hist(c,freq=FALSE, main = "korean" , xlab = "rate")
curve(dgamma(x,shape=kappa.mle,scale = theta.mle),from=1,to=5,col="red",lwd=2,add=TRUE)
curve(dweibull(x,shape=yita.mle,scale =beta.mle),from=1,to=5,col="blue",lwd=2,add=TRUE)
legend("topleft",legend=c("gamma","weibull"),col=c("red","blue"),lwd=2)







french.rate <- as.numeric(comb$rate[which(comb$title=="french")])
french.score <- as.numeric(comb$score[which(comb$title=="french")])
# hist(french.rate,freq=FALSE, main = "french" , xlab = "rating")
# hist(french.score,freq=FALSE, main = "french" , xlab = "score")

minuslogl.gam.rate <- function(theta, kappa) {
  y <- dgamma(french.rate, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.gam.score <- function(theta, kappa) {
  y <- dgamma(french.score, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.wei.rate <- function(yita, beta) {
  y <- suppressWarnings(dweibull(french.rate, shape = yita, scale = beta))
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.wei.score <- function(yita, beta) {
  y <- suppressWarnings(dweibull(french.score, shape = yita, scale = beta))
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

c <- french.score
n <- length(c)
kappa.mme <- (n*mean(c)^2) / ((n-1)*var(c))
theta.mme <- ((n-1)*var(c)) / (n*mean(c))
fit.gam.score <- mle(minuslogl.gam.score, start = list(theta = theta.mme, kappa = kappa.mme))
summary(fit.gam.score)
theta.mle <- fit.gam.score@coef[1]
kappa.mle <- fit.gam.score@coef[2]

fit.wei.score <- mle(minuslogl.wei.score, start = list(yita = 1, beta = 1))
summary(fit.wei.score)
yita.mle <- fit.wei.score@coef[1]
beta.mle <- fit.wei.score@coef[2]
hist(c,freq=FALSE, main = "french" , xlab = "score")
curve(dweibull(x,shape=yita.mle,scale =beta.mle),from=0,to=100,col="blue",lwd=2,add=TRUE)
curve(dgamma(x,shape=kappa.mle,scale = theta.mle),from=0,to=100,col="red",lwd=2,add=TRUE)
legend("topleft",legend=c("gamma","weibull"),col=c("red","blue"),lwd=2)

c <- french.rate
n <- length(c)
kappa.mme <- (n*mean(c)^2) / ((n-1)*var(c))
theta.mme <- ((n-1)*var(c)) / (n*mean(c))
fit.gam.rate <- mle(minuslogl.gam.rate, start = list(theta = theta.mme, kappa = kappa.mme))
summary(fit.gam.score)
theta.mle <- fit.gam.rate@coef[1]
kappa.mle <- fit.gam.rate@coef[2]

fit.wei.rate <- mle(minuslogl.wei.rate, start = list(yita = 1, beta = 1))
summary(fit.wei.rate)
yita.mle <- fit.wei.rate@coef[1]
beta.mle <- fit.wei.rate@coef[2]
hist(c,freq=FALSE, main = "french" , xlab = "rate")
curve(dgamma(x,shape=kappa.mle,scale = theta.mle),from=1,to=5,col="red",lwd=2,add=TRUE)
curve(dweibull(x,shape=yita.mle,scale =beta.mle),from=1,to=5,col="blue",lwd=2,add=TRUE)
legend("topleft",legend=c("gamma","weibull"),col=c("red","blue"),lwd=2)








indian.rate <- as.numeric(comb$rate[which(comb$title=="indian")])
indian.score <- as.numeric(comb$score[which(comb$title=="indian")])
# hist(indian.rate,freq=FALSE, main = "indian" , xlab = "rating")
# hist(indian.score,freq=FALSE, main = "indian" , xlab = "score")

minuslogl.gam.rate <- function(theta, kappa) {
  y <- dgamma(indian.rate, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.gam.score <- function(theta, kappa) {
  y <- dgamma(indian.score, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.wei.rate <- function(yita, beta) {
  y <- suppressWarnings(dweibull(indian.rate, shape = yita, scale = beta))
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.wei.score <- function(yita, beta) {
  y <- suppressWarnings(dweibull(indian.score, shape = yita, scale = beta))
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

c <- indian.score
n <- length(c)
kappa.mme <- (n*mean(c)^2) / ((n-1)*var(c))
theta.mme <- ((n-1)*var(c)) / (n*mean(c))
fit.gam.score <- mle(minuslogl.gam.score, start = list(theta = theta.mme, kappa = kappa.mme))
summary(fit.gam.score)
theta.mle <- fit.gam.score@coef[1]
kappa.mle <- fit.gam.score@coef[2]

fit.wei.score <- mle(minuslogl.wei.score, start = list(yita = 1, beta = 1))
summary(fit.wei.score)
yita.mle <- fit.wei.score@coef[1]
beta.mle <- fit.wei.score@coef[2]
hist(c,freq=FALSE, main = "indian" , xlab = "score")
curve(dweibull(x,shape=yita.mle,scale =beta.mle),from=0,to=100,col="blue",lwd=2,add=TRUE)
curve(dgamma(x,shape=kappa.mle,scale = theta.mle),from=0,to=100,col="red",lwd=2,add=TRUE)
legend("topleft",legend=c("gamma","weibull"),col=c("red","blue"),lwd=2)

c <- indian.rate
n <- length(c)
kappa.mme <- (n*mean(c)^2) / ((n-1)*var(c))
theta.mme <- ((n-1)*var(c)) / (n*mean(c))
fit.gam.rate <- mle(minuslogl.gam.rate, start = list(theta = theta.mme, kappa = kappa.mme))
summary(fit.gam.score)
theta.mle <- fit.gam.rate@coef[1]
kappa.mle <- fit.gam.rate@coef[2]

fit.wei.rate <- mle(minuslogl.wei.rate, start = list(yita = 1, beta = 1))
summary(fit.wei.rate)
yita.mle <- fit.wei.rate@coef[1]
beta.mle <- fit.wei.rate@coef[2]
hist(c,freq=FALSE, main = "indian" , xlab = "rate")
curve(dgamma(x,shape=kappa.mle,scale = theta.mle),from=1,to=5,col="red",lwd=2,add=TRUE)
curve(dweibull(x,shape=yita.mle,scale =beta.mle),from=1,to=5,col="blue",lwd=2,add=TRUE)
legend("topleft",legend=c("gamma","weibull"),col=c("red","blue"),lwd=2)









italian.rate <- as.numeric(comb$rate[which(comb$title=="italian")])
italian.score <- as.numeric(comb$score[which(comb$title=="italian")])
# hist(italian.rate,freq=FALSE, main = "indian" , xlab = "rating")
# hist(italian.score,freq=FALSE, main = "indian" , xlab = "score")

minuslogl.gam.rate <- function(theta, kappa) {
  y <- dgamma(italian.rate, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.gam.score <- function(theta, kappa) {
  y <- dgamma(italian.score, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.wei.rate <- function(yita, beta) {
  y <- suppressWarnings(dweibull(italian.rate, shape = yita, scale = beta))
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.wei.score <- function(yita, beta) {
  y <- suppressWarnings(dweibull(italian.score, shape = yita, scale = beta))
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

c <- italian.score
n <- length(c)
kappa.mme <- (n*mean(c)^2) / ((n-1)*var(c))
theta.mme <- ((n-1)*var(c)) / (n*mean(c))
fit.gam.score <- mle(minuslogl.gam.score, start = list(theta = theta.mme, kappa = kappa.mme))
summary(fit.gam.score)
theta.mle <- fit.gam.score@coef[1]
kappa.mle <- fit.gam.score@coef[2]

fit.wei.score <- mle(minuslogl.wei.score, start = list(yita = 1, beta = 1))
summary(fit.wei.score)
yita.mle <- fit.wei.score@coef[1]
beta.mle <- fit.wei.score@coef[2]
hist(c,freq=FALSE, main = "italian" , xlab = "score")
curve(dweibull(x,shape=yita.mle,scale =beta.mle),from=0,to=100,col="blue",lwd=2,add=TRUE)
curve(dgamma(x,shape=kappa.mle,scale = theta.mle),from=0,to=100,col="red",lwd=2,add=TRUE)
legend("topleft",legend=c("gamma","weibull"),col=c("red","blue"),lwd=2)

c <- italian.rate
n <- length(c)
kappa.mme <- (n*mean(c)^2) / ((n-1)*var(c))
theta.mme <- ((n-1)*var(c)) / (n*mean(c))
fit.gam.rate <- mle(minuslogl.gam.rate, start = list(theta = theta.mme, kappa = kappa.mme))
summary(fit.gam.score)
theta.mle <- fit.gam.rate@coef[1]
kappa.mle <- fit.gam.rate@coef[2]

fit.wei.rate <- mle(minuslogl.wei.rate, start = list(yita = 1, beta = 1))
summary(fit.wei.rate)
yita.mle <- fit.wei.rate@coef[1]
beta.mle <- fit.wei.rate@coef[2]
hist(c,freq=FALSE, main = "italian" , xlab = "rate")
curve(dgamma(x,shape=kappa.mle,scale = theta.mle),from=1,to=5,col="red",lwd=2,add=TRUE)
curve(dweibull(x,shape=yita.mle,scale =beta.mle),from=1,to=5,col="blue",lwd=2,add=TRUE)
legend("topleft",legend=c("gamma","weibull"),col=c("red","blue"),lwd=2)









latin.rate <- as.numeric(comb$rate[which(comb$title=="latin")])
latin.score <- as.numeric(comb$score[which(comb$title=="latin")])
# hist(latin.rate,freq=FALSE, main = "latin" , xlab = "rating")
# hist(latin.score,freq=FALSE, main = "latin" , xlab = "score")

minuslogl.gam.rate <- function(theta, kappa) {
  y <- dgamma(latin.rate, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.gam.score <- function(theta, kappa) {
  y <- dgamma(latin.score, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.wei.rate <- function(yita, beta) {
  y <- suppressWarnings(dweibull(latin.rate, shape = yita, scale = beta))
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.wei.score <- function(yita, beta) {
  y <- suppressWarnings(dweibull(latin.score, shape = yita, scale = beta))
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

c <- latin.score
n <- length(c)
kappa.mme <- (n*mean(c)^2) / ((n-1)*var(c))
theta.mme <- ((n-1)*var(c)) / (n*mean(c))
fit.gam.score <- mle(minuslogl.gam.score, start = list(theta = theta.mme, kappa = kappa.mme))
summary(fit.gam.score)
theta.mle <- fit.gam.score@coef[1]
kappa.mle <- fit.gam.score@coef[2]

fit.wei.score <- mle(minuslogl.wei.score, start = list(yita = 1, beta = 1))
summary(fit.wei.score)
yita.mle <- fit.wei.score@coef[1]
beta.mle <- fit.wei.score@coef[2]
hist(c,freq=FALSE, main = "latin" , xlab = "score")
curve(dweibull(x,shape=yita.mle,scale =beta.mle),from=0,to=100,col="blue",lwd=2,add=TRUE)
curve(dgamma(x,shape=kappa.mle,scale = theta.mle),from=0,to=100,col="red",lwd=2,add=TRUE)
legend("topleft",legend=c("gamma","weibull"),col=c("red","blue"),lwd=2)

c <- latin.rate
n <- length(c)
kappa.mme <- (n*mean(c)^2) / ((n-1)*var(c))
theta.mme <- ((n-1)*var(c)) / (n*mean(c))
fit.gam.rate <- mle(minuslogl.gam.rate, start = list(theta = theta.mme, kappa = kappa.mme))
summary(fit.gam.score)
theta.mle <- fit.gam.rate@coef[1]
kappa.mle <- fit.gam.rate@coef[2]

fit.wei.rate <- mle(minuslogl.wei.rate, start = list(yita = 1, beta = 1))
summary(fit.wei.rate)
yita.mle <- fit.wei.rate@coef[1]
beta.mle <- fit.wei.rate@coef[2]
hist(c,freq=FALSE, main = "latin" , xlab = "rate")
curve(dgamma(x,shape=kappa.mle,scale = theta.mle),from=1,to=5,col="red",lwd=2,add=TRUE)
curve(dweibull(x,shape=yita.mle,scale =beta.mle),from=1,to=5,col="blue",lwd=2,add=TRUE)
legend("topleft",legend=c("gamma","weibull"),col=c("red","blue"),lwd=2)









viet.rate <- as.numeric(comb$rate[which(comb$title=="viet")])
viet.score <- as.numeric(comb$score[which(comb$title=="viet")])
# hist(viet.rate,freq=FALSE, main = "latin" , xlab = "rating")
# hist(viet.score,freq=FALSE, main = "latin" , xlab = "score")

minuslogl.gam.rate <- function(theta, kappa) {
  y <- dgamma(viet.rate, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.gam.score <- function(theta, kappa) {
  y <- dgamma(viet.score, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.wei.rate <- function(yita, beta) {
  y <- suppressWarnings(dweibull(viet.rate, shape = yita, scale = beta))
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.wei.score <- function(yita, beta) {
  y <- suppressWarnings(dweibull(viet.score, shape = yita, scale = beta))
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

c <- viet.score
n <- length(c)
kappa.mme <- (n*mean(c)^2) / ((n-1)*var(c))
theta.mme <- ((n-1)*var(c)) / (n*mean(c))
fit.gam.score <- mle(minuslogl.gam.score, start = list(theta = theta.mme, kappa = kappa.mme))
summary(fit.gam.score)
theta.mle <- fit.gam.score@coef[1]
kappa.mle <- fit.gam.score@coef[2]

fit.wei.score <- mle(minuslogl.wei.score, start = list(yita = 1, beta = 1))
summary(fit.wei.score)
yita.mle <- fit.wei.score@coef[1]
beta.mle <- fit.wei.score@coef[2]
hist(c,freq=FALSE, main = "viet" , xlab = "score")
curve(dweibull(x,shape=yita.mle,scale =beta.mle),from=0,to=100,col="blue",lwd=2,add=TRUE)
curve(dgamma(x,shape=kappa.mle,scale = theta.mle),from=0,to=100,col="red",lwd=2,add=TRUE)
legend("topleft",legend=c("gamma","weibull"),col=c("red","blue"),lwd=2)

c <- viet.rate
n <- length(c)
kappa.mme <- (n*mean(c)^2) / ((n-1)*var(c))
theta.mme <- ((n-1)*var(c)) / (n*mean(c))
fit.gam.rate <- mle(minuslogl.gam.rate, start = list(theta = theta.mme, kappa = kappa.mme))
summary(fit.gam.score)
theta.mle <- fit.gam.rate@coef[1]
kappa.mle <- fit.gam.rate@coef[2]

fit.wei.rate <- mle(minuslogl.wei.rate, start = list(yita = 1, beta = 1))
summary(fit.wei.rate)
yita.mle <- fit.wei.rate@coef[1]
beta.mle <- fit.wei.rate@coef[2]
hist(c,freq=FALSE, main = "viet" , xlab = "rate")
curve(dgamma(x,shape=kappa.mle,scale = theta.mle),from=1,to=5,col="red",lwd=2,add=TRUE)
curve(dweibull(x,shape=yita.mle,scale =beta.mle),from=1,to=5,col="blue",lwd=2,add=TRUE)
legend("topleft",legend=c("gamma","weibull"),col=c("red","blue"),lwd=2)










thai.rate <- as.numeric(comb$rate[which(comb$title=="thai")])
thai.score <- as.numeric(comb$score[which(comb$title=="thai")])
# hist(thai.rate,freq=FALSE, main = "latin" , xlab = "rating")
# hist(thai.score,freq=FALSE, main = "latin" , xlab = "score")

minuslogl.gam.rate <- function(theta, kappa) {
  y <- dgamma(thai.rate, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.gam.score <- function(theta, kappa) {
  y <- dgamma(thai.score, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.wei.rate <- function(yita, beta) {
  y <- suppressWarnings(dweibull(thai.rate, shape = yita, scale = beta))
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.wei.score <- function(yita, beta) {
  y <- suppressWarnings(dweibull(thai.score, shape = yita, scale = beta))
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

c <- thai.score
n <- length(c)
kappa.mme <- (n*mean(c)^2) / ((n-1)*var(c))
theta.mme <- ((n-1)*var(c)) / (n*mean(c))
fit.gam.score <- mle(minuslogl.gam.score, start = list(theta = theta.mme, kappa = kappa.mme))
summary(fit.gam.score)
theta.mle <- fit.gam.score@coef[1]
kappa.mle <- fit.gam.score@coef[2]

fit.wei.score <- mle(minuslogl.wei.score, start = list(yita = 1, beta = 1))
summary(fit.wei.score)
yita.mle <- fit.wei.score@coef[1]
beta.mle <- fit.wei.score@coef[2]
hist(c,freq=FALSE, main = "thai" , xlab = "score")
curve(dweibull(x,shape=yita.mle,scale =beta.mle),from=0,to=100,col="blue",lwd=2,add=TRUE)
curve(dgamma(x,shape=kappa.mle,scale = theta.mle),from=0,to=100,col="red",lwd=2,add=TRUE)
legend("topleft",legend=c("gamma","weibull"),col=c("red","blue"),lwd=2)

c <- thai.rate
n <- length(c)
kappa.mme <- (n*mean(c)^2) / ((n-1)*var(c))
theta.mme <- ((n-1)*var(c)) / (n*mean(c))
fit.gam.rate <- mle(minuslogl.gam.rate, start = list(theta = theta.mme, kappa = kappa.mme))
summary(fit.gam.score)
theta.mle <- fit.gam.rate@coef[1]
kappa.mle <- fit.gam.rate@coef[2]

fit.wei.rate <- mle(minuslogl.wei.rate, start = list(yita = 1, beta = 1))
summary(fit.wei.rate)
yita.mle <- fit.wei.rate@coef[1]
beta.mle <- fit.wei.rate@coef[2]
hist(c,freq=FALSE, main = "thai" , xlab = "rate")
curve(dgamma(x,shape=kappa.mle,scale = theta.mle),from=1,to=5,col="red",lwd=2,add=TRUE)
curve(dweibull(x,shape=yita.mle,scale =beta.mle),from=1,to=5,col="blue",lwd=2,add=TRUE)
legend("topleft",legend=c("gamma","weibull"),col=c("red","blue"),lwd=2)







medi.rate <- as.numeric(comb$rate[which(comb$title=="medi")])
medi.score <- as.numeric(comb$score[which(comb$title=="medi")])
# hist(medi.rate,freq=FALSE, main = "medi" , xlab = "rating")
# hist(medi.score,freq=FALSE, main = "medi" , xlab = "score")

minuslogl.gam.rate <- function(theta, kappa) {
  y <- dgamma(medi.rate, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.gam.score <- function(theta, kappa) {
  y <- dgamma(medi.score, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.wei.rate <- function(yita, beta) {
  y <- suppressWarnings(dweibull(medi.rate, shape = yita, scale = beta))
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.wei.score <- function(yita, beta) {
  y <- suppressWarnings(dweibull(medi.score, shape = yita, scale = beta))
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

c <- medi.score
n <- length(c)
kappa.mme <- (n*mean(c)^2) / ((n-1)*var(c))
theta.mme <- ((n-1)*var(c)) / (n*mean(c))
fit.gam.score <- mle(minuslogl.gam.score, start = list(theta = theta.mme, kappa = kappa.mme))
summary(fit.gam.score)
theta.mle <- fit.gam.score@coef[1]
kappa.mle <- fit.gam.score@coef[2]

fit.wei.score <- mle(minuslogl.wei.score, start = list(yita = 1, beta = 1))
summary(fit.wei.score)
yita.mle <- fit.wei.score@coef[1]
beta.mle <- fit.wei.score@coef[2]
hist(c,freq=FALSE, main = "medi" , xlab = "score")
curve(dweibull(x,shape=yita.mle,scale =beta.mle),from=0,to=100,col="blue",lwd=2,add=TRUE)
curve(dgamma(x,shape=kappa.mle,scale = theta.mle),from=0,to=100,col="red",lwd=2,add=TRUE)
legend("topleft",legend=c("gamma","weibull"),col=c("red","blue"),lwd=2)

c <- medi.rate
n <- length(c)
kappa.mme <- (n*mean(c)^2) / ((n-1)*var(c))
theta.mme <- ((n-1)*var(c)) / (n*mean(c))
fit.gam.rate <- mle(minuslogl.gam.rate, start = list(theta = theta.mme, kappa = kappa.mme))
summary(fit.gam.score)
theta.mle <- fit.gam.rate@coef[1]
kappa.mle <- fit.gam.rate@coef[2]

fit.wei.rate <- mle(minuslogl.wei.rate, start = list(yita = 1, beta = 1))
summary(fit.wei.rate)
yita.mle <- fit.wei.rate@coef[1]
beta.mle <- fit.wei.rate@coef[2]
hist(c,freq=FALSE, main = "medi" , xlab = "rate")
curve(dgamma(x,shape=kappa.mle,scale = theta.mle),from=1,to=5,col="red",lwd=2,add=TRUE)
curve(dweibull(x,shape=yita.mle,scale =beta.mle),from=1,to=5,col="blue",lwd=2,add=TRUE)
legend("topleft",legend=c("gamma","weibull"),col=c("red","blue"),lwd=2)




boxplot(comb$rate ~ comb$title)
boxplot(comb$score ~ comb$title)

# minuslogl.gam <- function(theta, kappa) {
#   y <- dgamma(data, shape = kappa, scale = theta)
#   # return -sum ln(y)
#   nLL <- -sum(log(y))
#   return(nLL)
# }

# minuslogl.gam <- function(theta, kappa) {
#   y <- dgamma(chinese.score, shape = kappa, scale = theta)
#   # return -sum ln(y)
#   nLL <- -sum(log(y))
#   return(nLL)
# }
# c <- chinese.score
# n <- length(c)
# kappa.mme <- (n*mean(c)^2) / ((n-1)*var(c))
# theta.mme <- ((n-1)*var(c)) / (n*mean(c))
# fit.gam <- mle(minuslogl.gam, start = list(theta = theta.mme, kappa = kappa.mme))
# summary(fit.gam)
# theta.mle <- fit.gam@coef[1]
# kappa.mle <- fit.gam@coef[2]
# print(theta.mle)
# hist(chinese.score,freq=FALSE, main = "chinese" , xlab = "score")
# curve(dgamma(x,shape=kappa.mle,scale = theta.mle),from=0,to=100,col="red",lwd=2,add=TRUE)
# 
# minuslogl.wei <- function(yita, beta) {
# y <- suppressWarnings(dweibull(sal, shape = yita, scale = beta))
# # return -sum ln(y)
# nLL <- -sum(log(y))
# return(nLL)
# }
# 
# fit.wei <- mle(minuslogl.wei, start = list(yita = 1, beta = 1))
# summary(fit.wei)
# yita.mle <- fit.wei@coef[1]
# beta.mle <- fit.wei@coef[2]
# curve(dweibull(x,shape=yita.mle,scale =beta.mle),from=0,to=250,col="blue",lwd=2,add=TRUE)
# legend("topright",legend=c("gamma","weibull"),col=c("red","blue"),lwd=2)
