export default function CrisisModal({ crisis, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="text-5xl mb-4">💚</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">You are not alone</h2>
        <p className="text-gray-600 mb-6">We noticed you might be going through a tough time. We're here for you.</p>
        <div className="space-y-3">
          <button onClick={onClose} className="w-full py-3 bg-calm-500 text-white rounded-xl hover:bg-calm-600 font-medium">
            💬 Continue talking to AI
          </button>
          <a href="/mentor" className="block w-full py-3 bg-brand-500 text-white rounded-xl hover:bg-brand-600 font-medium">
            🤝 Connect with a Mentor
          </a>
          <a
            href="https://988lifeline.org"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 bg-danger-50 text-danger-600 rounded-xl hover:bg-danger-100 font-medium"
          >
            📞 Emergency Resources (988 Lifeline)
          </a>
          <button onClick={onClose} className="w-full py-2 text-gray-400 hover:text-gray-600 text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
