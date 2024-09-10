
export const generateResponse = (res, status, message, data, success) => {
    res.status(status).json({
      success,
      message: message,
      data: data,
    });
  };