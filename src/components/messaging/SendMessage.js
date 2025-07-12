// Send Message Component
const SendMessage = ({ userId, navigate }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await api.sendMessage(userId, content);
      if (result.success) {
        setSuccess(true);
        setContent("");
      } else {
        setError(result.message || "Failed to send message");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
            <Send className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Message Sent!
          </h2>
          <p className="text-gray-600 mb-6">
            Your anonymous message has been delivered.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-purple-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
            <MessageCircle className="h-10 w-10 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Send Anonymous Message
          </h2>
          <p className="text-gray-600 mt-2">
            Your message will be delivered anonymously
          </p>
        </div>

        <div onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
              rows="6"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <Button onClick={handleSubmit} loading={loading}>
            <Send className="h-4 w-4" />
            Send Message
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            This message will be sent anonymously. The recipient won't know who
            sent it.
          </p>
        </div>
      </div>
    </div>
  );
};
