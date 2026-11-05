export const sendPaymentConfirmationEmail = async (
  email: string,
  studentName: string,
  accessCode: string
) => {
  const emailContent = {
    to: email,
    subject: 'EasyBook Access Code Confirmation',
    text: `Hello ${studentName},\n\nYour payment has been successfully confirmed. Your access code is ${accessCode}.\n\nInstructions:\n1. Open EasyBook app.\n2. Tap "Unlock Full".\n3. Go to "Enter Code" tab.\n4. Paste/Type your code and tap "Activate".\n\nEnjoy learning!`,
    html: `
      <h2>Hello ${studentName},</h2>
      <p>Your payment has been successfully confirmed!</p>
      <p>Your access code is: <strong>${accessCode}</strong></p>
      <h3>Instructions:</h3>
      <ol>
        <li>Open EasyBook app.</li>
        <li>Tap <strong>"Unlock Full"</strong>.</li>
        <li>Go to <strong>"Enter Code"</strong> tab.</li>
        <li>Paste/Type your code and tap <strong>"Activate"</strong>.</li>
      </ol>
      <p>Enjoy learning!</p>
    `,
  };

  try {
    console.log('Sending email request to /api/send-email...');
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailContent),
    });

    if (response.status === 503) {
      console.warn('Email service not configured, skipping email.');
      return { message: 'Email service not configured' };
    }

    if (!response.ok) {
      console.error('Server responded with error:', response.status, response.statusText);
      throw new Error(`Failed to send confirmation email: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const data = await response.json();
      console.log('Email sent successfully:', data);
      return data;
    } else {
      console.error('Expected JSON, but received:', contentType);
      throw new Error('Server returned non-JSON response');
    }
  } catch (error) {
    console.error('Email sending failed in emailService:', error);
    throw error;
  }
};
