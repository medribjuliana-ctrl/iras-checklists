export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Página não encontrada
        </h1>
        <p className="text-gray-600 mb-6">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="text-sm text-gray-500 mb-6">
          <p>URL atual: <code className="bg-gray-100 px-2 py-1 rounded">{typeof window !== 'undefined' ? window.location.pathname : 'N/A'}</code></p>
        </div>
        <a
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Voltar ao início
        </a>
      </div>
    </div>
  );
}