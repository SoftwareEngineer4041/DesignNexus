namespace IAM.Application.DTOs
{
    public class BaseResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; }

        public static BaseResponseDto SuccessResponse(string message)
        {
            return new BaseResponseDto
            {
                Success = true,
                Message = message
            };
        }

        public static BaseResponseDto FailureResponse(string message)
        {
            return new BaseResponseDto
            {
                Success = false,
                Message = message
            };
        }
    }
}