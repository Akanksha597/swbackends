module.exports = ({ mobileNumber, pdfUrl }) => {
  const message = encodeURIComponent(
    `📄 Hello!\n\nDownload your PDF here:\n${pdfUrl}`
  );

  return `https://wa.me/91${mobileNumber}?text=${message}`;
};
