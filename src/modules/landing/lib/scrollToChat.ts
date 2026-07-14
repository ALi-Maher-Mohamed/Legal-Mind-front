export function scrollToChat() {
  const chatInput = document.querySelector('input[type="text"]');
  if (chatInput) {
    chatInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    (chatInput as HTMLInputElement).focus();
    return;
  }
  window.scrollTo({ top: window.innerHeight * 1.5, behavior: 'smooth' });
}
