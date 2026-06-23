const sgMail = require('@sendgrid/mail')

// set API key once
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
console.log('SENDGRID KEY:', process.env.SENDGRID_API_KEY)

// ─── Send Welcome Email ───────────────────────────────────
const sendWelcomeEmail = async (toEmail, name) => {
  const msg = {
    to: toEmail,                          // recipient
    from: process.env.FROM_EMAIL,         // your verified sender
    subject: 'Welcome to Habit Tracker!',
    html: `
      <h1>Welcome ${name}! 🎉</h1>
      <p>You have successfully registered to Habit Tracker.</p>
      <p>Start building your habits today!</p>
    `
  }

 try {
    const response = await sgMail.send(msg)
    console.log('Email sent! Status:', response[0].statusCode)
  } catch (error) {
    console.error('Email error:', error.message)
    if (error.response) {
      console.error('SendGrid error details:', error.response.body)
    }
  }
}

// ─── Send Password Reset Email ────────────────────────────
const sendPasswordResetEmail = async (toEmail, resetToken) => {
  const resetURL = `http://localhost:5173/reset-password?token=${resetToken}`

  const msg = {
    to: toEmail,
    from: process.env.FROM_EMAIL,
    subject: 'Password Reset Request',
    html: `
      <h2>Password Reset</h2>
      <p>You requested a password reset.</p>
      <p>Click the link below — expires in 15 minutes:</p>
      <a href="${resetURL}">${resetURL}</a>
      <p>If you didn't request this, ignore this email.</p>
    `
  }

  try {
    await sgMail.send(msg)
    console.log(`Reset email sent to ${toEmail}`)
  } catch (error) {
    console.error('Email error:', error.message)
    throw error    // throw here — reset flow needs email to work
  }
}

// ─── Send Streak Milestone Email ──────────────────────────
const sendStreakMilestoneEmail = async (toEmail, name, streak) => {
  const msg = {
    to: toEmail,
    from: process.env.FROM_EMAIL,
    subject: `🔥 ${streak} Day Streak!`,
    html: `
      <h2>Amazing ${name}!</h2>
      <p>You have reached a ${streak} day streak! 🔥</p>
      <p>Keep it up!</p>
    `
  }

  try {
    await sgMail.send(msg)
  } catch (error) {
    console.error('Email error:', error.message)
  }
}

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendStreakMilestoneEmail
}