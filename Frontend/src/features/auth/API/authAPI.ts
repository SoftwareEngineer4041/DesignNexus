
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5157/iam";

/* ---------- Login ---------- */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  [key: string]: any;
}

export async function loginUser(
  credentials: LoginRequest
): Promise<LoginResponse> {
  const response = await fetch(`${BASE_URL}/api/Auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    let message = "ایمیل یا رمز عبور اشتباه است";

    try {
      const data = await response.json();
      if (data?.message) message = data.message;
    } catch {}

    throw new Error(message);
  }

  return await response.json();
}

/* ---------- Register ---------- */


export interface RegisterForm {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface RegisterResponse {
  message?: string;
  [key: string]: any;
}

// فرض می‌کنم BASE_URL رو جای دیگه تعریف کردی و اینجا ایمپورت می‌کنی
// import { BASE_URL } from "./config";

export async function registerUser(
  form: RegisterForm
): Promise<RegisterResponse> {
  const response = await fetch(`${BASE_URL}/api/Auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(form),
  });

  if (!response.ok) {
    // اینجا بدنه‌ی خطا رو می‌خونیم (همون { errors: { Password: [...] } })
    let errBody: any;

    try {
      errBody = await response.json();
    } catch {
      // اگر نتونستیم JSON بخونیم، یه پیام کلی برمی‌گردونیم
      throw { message: "خطای ثبت‌نام" };
    }

    // همون چیزی که بک‌اند فرستاده رو می‌اندازیم بیرون
    // مثلاً: { errors: { Password: ["رمز باید 8 کاراکتر باشد"] } }
    throw errBody;
  }

  // در صورت موفقیت
  return await response.json();
}

/* ---------- Verify Code ---------- */

export interface VerifyPayload {
  email: string;
  otp: string;
}

export interface VerifyResponse {
  message?: string;
  token?: string;
  name?: string;
  [key: string]: any;
}

export async function verifyCode(
  payload: VerifyPayload
): Promise<VerifyResponse> {
  const response = await fetch(`${BASE_URL}/api/Auth/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "کد تأیید اشتباه است";

    try {
      const err = await response.json();
      if (err?.message) message = err.message;
    } catch {}

    throw new Error(message);
  }

  return await response.json();
}

/* ---------- Resend Code to Signup---------- */

export interface ResendCodePayload {
  email: string;   
}

export async function resendCode(
  payload: ResendCodePayload
): Promise<{ message: string }> {
  const response = await fetch(`${BASE_URL}/api/Auth/resend-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "خطا در ارسال کد جدید";

    try {
      const err = await response.json();
      if (err?.message) message = err.message;
    } catch {}

    throw new Error(message);
  }

  return await response.json();
}



//-------------------verify code to change password-----------------//


// export interface ResendCodePayload {
//   email: string;   
// }

// export async function resendCodeToChangePassword(
//   payload: ResendCodePayload
// ): Promise<{ message: string }> {
//   const response = await fetch(`${BASE_URL}/api/Auth/resend-code`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify(payload),
//   });

//   if (!response.ok) {
//     let message = "خطا در ارسال کد جدید";

//     try {
//       const err = await response.json();
//       if (err?.message) message = err.message;
//     } catch {}

//     throw new Error(message);
//   }

//   return await response.json();


// }

/* ---------- Verify Code for Change Password ---------- */

// export interface VerifyPayload {
//   email: string;
//   otp: string;
// }

// export interface VerifyResponse {
//   token?: string;
//   name?: string;
//   message?: string;
//   // [key: string]: any;
// }

// export async function verifyCodeToChangePassword(
//   payload: VerifyPayload
// ): Promise<VerifyResponse> {
//   const response = await fetch(`${BASE_URL}/api/Auth/verify-change-password`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify(payload),
//   });

//   if (!response.ok) {
//     let message = "کد تأیید اشتباه است";
//     try {
//       const err = await response.json();
//       if (err?.message) message = err.message;
//     } catch {}
//     throw new Error(message);
//   }

//   return await response.json();
// }



/* ---------- Resend Code for Change Password ---------- */

// export interface ResendCodePayload {
//   email: string;
// }

// export async function resendCodeToChangePassword(
//   payload: ResendCodePayload
// ): Promise<{ message: string }> {
//   const response = await fetch(`${BASE_URL}/api/Auth/resend-code`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify(payload),
//   });

//   if (!response.ok) {
//     let message = "خطا در ارسال کد جدید";
//     try {
//       const err = await response.json();
//       if (err?.message) message = err.message;
//     } catch {}
//     throw new Error(message);
//   }

//   return await response.json();
// }



/* ---------- Verify Code for Change Password ---------- */
export interface VerifyPayload {
  email: string;
  otp: string;
}

export interface VerifyResponse {
  token?: string;
  name?: string;
  message?: string;
}

export async function verifyCodeToChangePassword(
  payload: VerifyPayload
): Promise<VerifyResponse> {
  const response = await fetch(`${BASE_URL}/api/Auth/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "کد تأیید اشتباه است";
    try {
      const err = await response.json();
      if (err?.message) message = err.message;
    } catch {}
    throw new Error(message);
  }

  return await response.json();
}

/* ---------- Resend Code for Change Password ---------- */
export interface ResendCodePayload {
  email: string;
}

export async function resendCodeToChangePassword(
  payload: ResendCodePayload
): Promise<{ message: string }> {
  const response = await fetch(`${BASE_URL}/api/Auth/resend-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "خطا در ارسال کد جدید";
    try {
      const err = await response.json();
      if (err?.message) message = err.message;
    } catch {}
    throw new Error(message);
  }

  return await response.json();
}

/* ---------- Change Password ---------- */
export interface ChangePasswordPayload {
  email: string;
  password: string;
  confirmPassword: string;
  otp: string;
}

export async function changePassword(payload: ChangePasswordPayload) {
  const res = await fetch(`${BASE_URL}/api/Auth/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "تغییر رمز عبور انجام نشد");
  }

  return res.json();
}





// -------------------------------
// CHANGE PASSWORD
// -------------------------------
// export async function changePassword(payload: {
//   email: string;
//   password: string;
//   confirmPassword: string;
//   otp : string;
// }) {
//   const res = await fetch(`${BASE_URL}/change-password`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.detail || "تغییر رمز عبور انجام نشد");
//   }

//   return res.json();
// }



/* ---------- Password Reset (Forgot Password) ---------- */

export interface PasswordResetPayload {
  email: string;
}

export interface PasswordResetResponse {
  message?: string;
  [key: string]: any;
}

export async function sendPasswordResetLink(
  payload: PasswordResetPayload
): Promise<PasswordResetResponse> {
  const response = await fetch(
    `${BASE_URL}/api/Auth/forgot-password`, 
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    let message = "خطا در ارسال لینک بازنشانی رمز عبور";

    try {
      const err = await response.json();
      if (err?.message) message = err.message;
    } catch {}

    throw new Error(message);
  }

  return await response.json();
}

