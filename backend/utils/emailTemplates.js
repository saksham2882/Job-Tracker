export const getResetPasswordTemplate = (fullName, resetCode) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }
        .header h1 {
            color: #007bff;
            font-size: 24px;
            margin: 0;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .content p {
            font-size: 16px;
            line-height: 1.5;
            margin: 10px 0;
        }
        .reset-code {
            display: inline-block;
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
            background: #f8f9fa;
            padding: 10px 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 14px;
            color: #666;
        }
        .footer a {
            color: #007bff;
            text-decoration: none;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>JobTracker Password Reset</h1>
        </div>
        <div class="content">
            <p>Dear ${fullName},</p>
            <p>We received a request to reset your JobTracker account password. Please use the following 6-digit code to reset your password:</p>
            <div class="reset-code">${resetCode}</div>
            <p>This code is valid for 1 hour. If you did not request a password reset, please ignore this email or contact our support team.</p>
            <a href="https://trackmyjobs.vercel.app/reset-password" class="button">Reset Password</a>
        </div>
        <div class="footer">
            <p>Best regards,<br>JobTracker Support Team</p>
            <p><a href="https://trackmyjobs.vercel.app">Contact Support</a> | <a href="https://trackmyjobs.vercel.app">Visit JobTracker</a></p>
        </div>
    </div>
</body>
</html>
  `;
};