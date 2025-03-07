const sendOtpEmail = async (email, otp) => {
    try {
            const mailOptions = {
              from: process.env['EMAIL_FROM'],
              to: email,
              subject: 'Your OTP Code',
              text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
            };
            await transporter.sendMail(mailOptions);
            console.log('email send live ',process.env['EMAIL_QUEUE']);
          } catch (error) {
      console.error(`Error sending OTP email: ${error.message}`);
      return false;
    }
  };