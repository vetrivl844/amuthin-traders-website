const subscribedEmails: string[] = [];

export const newsletterService = {
  subscribe: async (email: string): Promise<{ success: boolean; message: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    if (subscribedEmails.includes(trimmed)) {
      return { success: true, message: 'You are already subscribed to Amuthin Traders updates!' };
    }
    subscribedEmails.push(trimmed);
    return {
      success: true,
      message: 'Nandri! Thank you for subscribing to healthy millet recipes and offers.',
    };
  },
};
