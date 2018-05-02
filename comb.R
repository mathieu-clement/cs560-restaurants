setwd("/Users/ziyuanhan/Desktop")
comb <- read.csv("comb.csv",fill = TRUE,na.strings = c(""),header = TRUE)
# par(mfrow=c(2,1))

chinese.rate <- as.numeric(comb$rate[which(comb$title=="chinese")])
chinese.score <- as.numeric(comb$score[which(comb$title=="chinese")])
hist(chinese.rate,freq=FALSE, main = "chinese" , xlab = "rating")
hist(chinese.score,freq=FALSE, main = "chinese" , xlab = "score")

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
hist(chinese.score,freq=FALSE, main = "chinese" , xlab = "score")
curve(dweibull(x,shape=yita.mle,scale =beta.mle),from=0,to=100,col="blue",lwd=2,add=TRUE)
curve(dgamma(x,shape=kappa.mle,scale = theta.mle),from=0,to=100,col="red",lwd=2,add=TRUE)
legend("topright",legend=c("gamma","weibull"),col=c("red","blue"),lwd=2)

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
hist(chinese.rate,freq=FALSE, main = "chinese" , xlab = "rate")
curve(dgamma(x,shape=kappa.mle,scale = theta.mle),from=1,to=5,col="red",lwd=2,add=TRUE)
curve(dweibull(x,shape=yita.mle,scale =beta.mle),from=1,to=5,col="blue",lwd=2,add=TRUE)
legend("topright",legend=c("gamma","weibull"),col=c("red","blue"),lwd=2)





american.rate <- comb$rate[which(comb$title=="american")]
american.score <- comb$score[which(comb$title=="american")]
hist(american.rate,freq=FALSE, main = "american" , xlab = "rating")
hist(american.score,freq=FALSE, main = "american" , xlab = "score")

minuslogl.gam <- function(theta, kappa) {
  y <- dgamma(chinese.score, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.gam <- function(theta, kappa) {
  y <- dgamma(chinese.score, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}






japan.rate <- as.numeric(comb$rate[which(comb$title=="japanese")])
japan.score <- as.numeric(comb$score[which(comb$title=="japanese")])
hist(japan.rate,freq=FALSE, main = "japanese" , xlab = "rating")
hist(japan.score,freq=FALSE, main = "japanese" , xlab = "score")

minuslogl.gam <- function(theta, kappa) {
  y <- dgamma(chinese.score, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.gam <- function(theta, kappa) {
  y <- dgamma(chinese.score, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}






korean.rate <- as.numeric(comb$rate[which(comb$title=="korean")])
korean.score <- as.numeric(comb$score[which(comb$title=="korean")])
hist(korean.rate,freq=FALSE, main = "korean" , xlab = "rating")
hist(korean.score,freq=FALSE, main = "korean" , xlab = "score")

minuslogl.gam <- function(theta, kappa) {
  y <- dgamma(chinese.score, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.gam <- function(theta, kappa) {
  y <- dgamma(chinese.score, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}






french.rate <- as.numeric(comb$rate[which(comb$title=="french")])
french.score <- as.numeric(comb$score[which(comb$title=="french")])
hist(french.rate,freq=FALSE, main = "french" , xlab = "rating")
hist(french.score,freq=FALSE, main = "french" , xlab = "score")

minuslogl.gam <- function(theta, kappa) {
  y <- dgamma(chinese.score, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.gam <- function(theta, kappa) {
  y <- dgamma(chinese.score, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}







indian.rate <- as.numeric(comb$rate[which(comb$title=="indian")])
indian.score <- as.numeric(comb$score[which(comb$title=="indian")])
hist(indian.rate,freq=FALSE, main = "indian" , xlab = "rating")
hist(indian.score,freq=FALSE, main = "indian" , xlab = "score")

minuslogl.gam <- function(theta, kappa) {
  y <- dgamma(chinese.score, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.gam <- function(theta, kappa) {
  y <- dgamma(chinese.score, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}








italian.rate <- as.numeric(comb$rate[which(comb$title=="italian")])
italian.score <- as.numeric(comb$score[which(comb$title=="italian")])
hist(italian.rate,freq=FALSE, main = "indian" , xlab = "rating")
hist(italian.score,freq=FALSE, main = "indian" , xlab = "score")

minuslogl.gam <- function(theta, kappa) {
  y <- dgamma(chinese.score, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.gam <- function(theta, kappa) {
  y <- dgamma(chinese.score, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}








latin.rate <- as.numeric(comb$rate[which(comb$title=="latin")])
latin.score <- as.numeric(comb$score[which(comb$title=="latin")])
hist(latin.rate,freq=FALSE, main = "latin" , xlab = "rating")
hist(latin.score,freq=FALSE, main = "latin" , xlab = "score")

minuslogl.gam <- function(theta, kappa) {
  y <- dgamma(chinese.score, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.gam <- function(theta, kappa) {
  y <- dgamma(chinese.score, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}








viet.rate <- as.numeric(comb$rate[which(comb$title=="viet")])
viet.score <- as.nuemric(comb$score[which(comb$title=="viet")])
hist(viet.rate,freq=FALSE, main = "latin" , xlab = "rating")
hist(viet.score,freq=FALSE, main = "latin" , xlab = "score")

minuslogl.gam <- function(theta, kappa) {
  y <- dgamma(chinese.score, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.gam <- function(theta, kappa) {
  y <- dgamma(chinese.score, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}









thai.rate <- as.numeric(comb$rate[which(comb$title=="thai")])
thai.score <- as.numeric(comb$score[which(comb$title=="thai")])
hist(thai.rate,freq=FALSE, main = "latin" , xlab = "rating")
hist(thai.score,freq=FALSE, main = "latin" , xlab = "score")

minuslogl.gam <- function(theta, kappa) {
  y <- dgamma(chinese.score, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.gam <- function(theta, kappa) {
  y <- dgamma(chinese.score, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}






medi.rate <- as.numeric(comb$rate[which(comb$title=="medi")])
medi.score <- as.numeric(comb$score[which(comb$title=="medi")])
hist(medi.rate,freq=FALSE, main = "medi" , xlab = "rating")
hist(medi.score,freq=FALSE, main = "medi" , xlab = "score")

minuslogl.gam <- function(theta, kappa) {
  y <- dgamma(chinese.score, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}

minuslogl.gam <- function(theta, kappa) {
  y <- dgamma(chinese.score, shape = kappa, scale = theta)
  # return -sum ln(y)
  nLL <- -sum(log(y))
  return(nLL)
}




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
