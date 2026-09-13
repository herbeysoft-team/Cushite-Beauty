import { motion } from "framer-motion";

// TODO: replace with your real WhatsApp number, international format,
// digits only — no "+", no spaces, no leading 0 on the area code.
// e.g. UK mobile 07123 456789 -> "447123456789"
const WHATSAPP_NUMBER = "+2348022407013";
const WHATSAPP_MESSAGE = "Hi! I need help with my order. Can you assist me?";

/**
 * WhatsAppButton — fixed circular button, bottom-right, on every page.
 * Two staggered expanding rings give a continuous "pulse" behind the
 * button, plus a gentle breathing scale on the button itself, so it
 * stays noticeable without being obnoxious.
 */
function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center"
    >
      {/* Pulsing rings, staggered so one is always mid-expansion */}
      <motion.span
        className="absolute inset-0 rounded-full bg-[#25D366]"
        animate={{ scale: [1, 1.9], opacity: [0.55, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.span
        className="absolute inset-0 rounded-full bg-[#25D366]"
        animate={{ scale: [1, 1.9], opacity: [0.55, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 1.1 }}
      />

      {/* The button itself */}
      <motion.span
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg"
      >
        <svg viewBox="0 0 32 32" className="h-7 w-7 fill-white">
          <path d="M16.004 3C9.376 3 4 8.373 4 15c0 2.386.7 4.61 1.902 6.484L4 29l7.706-1.87A11.94 11.94 0 0 0 16.004 27C22.632 27 28 21.627 28 15S22.632 3 16.004 3Zm.001 21.818c-1.94 0-3.75-.57-5.27-1.552l-.378-.24-4.573 1.11 1.146-4.46-.246-.39A9.75 9.75 0 0 1 5.25 15c0-5.376 4.377-9.75 9.755-9.75 5.377 0 9.744 4.374 9.744 9.75 0 5.376-4.367 9.818-9.744 9.818Zm5.36-7.31c-.294-.147-1.74-.858-2.01-.955-.27-.098-.467-.147-.664.147-.196.294-.762.955-.934 1.152-.172.196-.344.22-.638.073-.294-.147-1.241-.457-2.365-1.457-.874-.78-1.464-1.744-1.636-2.038-.172-.294-.018-.453.129-.6.132-.132.294-.344.441-.516.147-.172.196-.294.294-.49.098-.196.049-.368-.024-.516-.073-.147-.664-1.6-.91-2.19-.24-.577-.484-.5-.664-.51-.172-.008-.368-.01-.564-.01-.196 0-.516.073-.786.368-.27.294-1.03 1.007-1.03 2.455 0 1.449 1.055 2.849 1.202 3.045.147.196 2.077 3.17 5.032 4.444.703.303 1.251.484 1.679.62.706.225 1.348.193 1.856.117.566-.085 1.74-.712 1.985-1.4.245-.688.245-1.278.172-1.4-.073-.122-.27-.196-.564-.343Z" />
        </svg>
      </motion.span>
    </a>
  );
}

export default WhatsAppButton;