const handleError = (error) => {
  console.log(error); // 輸出錯誤訊息到後端的日誌中

  // 轉換錯誤訊息格式
  const formattedError = {
    message: error.message, // 錯誤訊息
    // code: error.extensions.code, // 錯誤代碼（可選）
    // 其他自定義錯誤屬性（可選）
  };

  // 將錯誤訊息添加到 GraphQL 回應的 extensions 屬性中
  error.extensions = {
    ...error.extensions,
    formattedError,
  };

  return error;
};

module.exports = {
  handleError,
};
