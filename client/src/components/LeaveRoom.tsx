function LeavePage({ onReturn }: { onReturn: () => void }) {
    return (
      <div className="h-screen flex justify-center items-center bg-black">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
          <h1 className="text-2xl font-bold mb-4">You have left the chat</h1>
          <button
            onClick={onReturn}
            className="bg-blue-500 text-white p-3 rounded w-full hover:bg-blue-600"
          >
            Return to Chat
          </button>
        </div>
      </div>
    );
  }
  
  export default LeavePage;