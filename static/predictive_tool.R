# datavis FP3 Predictive tool: load dataframe for predictive tool
predictive_tool <- read.csv("/Users/shelleychoi/Desktop/6.C85/myproject/public/predictive_tool_final.csv")

# run models for predictive tool
library(broom) # 538 x 27
library(tidyverse)
price_model <- lm(median_price ~ r_mhi + o_mhi +
                    lat.x + nhas + nhna + nhaa + nhwhi +
                    pop_65o + pop_18_64 + pop_u18 +
                    male + female +
                    pop + num_sales_transactions +
                    sum_institutional_investor +
                    sum_large_investor+
                    sum_medium_investor+
                    sum_small_investor+
                    sum_non_investor+
                    median_intersf+
                    mortgage.x,
                  data = predictive_tool)

# model for investment rate
inv_model <- lm(100*perc_investor ~ r_mhi + o_mhi +
                  lat.x + nhas + nhna + nhaa + nhwhi +
                  pop_65o + pop_18_64 + pop_u18 +
                  male + female +
                  pop + num_sales_transactions +
                  sum_institutional_investor +
                  sum_large_investor+
                  sum_medium_investor+
                  sum_small_investor+
                  sum_non_investor+
                  median_intersf+
                  mortgage.x,
                data = predictive_tool)
summary(inv_model)

simple_inv_model <- lm(100*perc_investor ~ r_mhi + o_mhi +
                  lat.x + nhas + nhna + nhaa + nhwhi +
                  pop_65o + pop_18_64 + pop_u18 +
                  male + female +
                  pop + num_sales_transactions +
                  mortgage.x,
                data = predictive_tool)

summary(simple_inv_model)
summary(predictive_tool$perc_investor*100) # the first through third quartiles range from 0.39 - 0.41.

flip_model <- lm(median_flip_horizon ~ r_mhi + o_mhi +
                   lat.x + nhas + nhna + nhaa + nhwhi +
                   pop_65o + pop_18_64 + pop_u18 +
                   male + female +
                   pop + num_sales_transactions +
                   sum_institutional_investor +
                   sum_large_investor+
                   sum_medium_investor+
                   sum_small_investor+
                   sum_non_investor+
                   median_intersf+
                   mortgage.x,
                 data = predictive_tool)




predicted_values <- data.frame(zip = character(), median_price = numeric(), investment_rate = numeric(), flip_horizon = numeric())

predict_median_val <- function(zip_code, model, data) {
  input_data <- subset(data, zip == zip_code)
  
  if (nrow(input_data) == 0) {
    stop("No data found for the given ZIP code.")
  } else if (nrow(input_data) > 1) {
    warning("Multiple matches found for the given ZIP code. Averaging the predictions.")
    predictions <- predict(model, newdata = input_data)
    predicted_val <- mean(predictions)
  } else {
    predicted_val <- predict(model, newdata = input_data)
  }
  return(predicted_val)
}

unique_zips <- unique(predictive_tool$zip)
for (zip_code in unique_zips) {
  predicted_price <- predict_median_val(zip_code, price_model, predictive_tool)
  predicted_inv <- predict_median_val(zip_code, simple_inv_model, predictive_tool)
  predicted_flip <- predict_median_val(zip_code, flip_model, predictive_tool)
  predicted_values <- rbind(predicted_values, data.frame(zip = zip_code, median_price = predicted_price, investment_rate = predicted_inv, flip_horizon = predicted_flip))
}

predicted_values$zip <- paste0("0", predicted_values$zip)

predicted_values <- na.omit(predicted_values)

output_path <- "/Users/shelleychoi/Desktop/6.C85/myproject/public/predictive_values.csv"
write.csv(predicted_values, file = output_path, row.names = FALSE)
