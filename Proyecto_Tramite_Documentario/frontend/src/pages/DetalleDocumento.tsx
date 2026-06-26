
import { useParams, Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

const DetalleDocumento = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <Link to="/bandeja" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Volver a la bandeja
      </Link>
      
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
          <FileText className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Detalle del Documento #{id}</h2>
          <p className="text-gray-500">Historial y flujo del trámite</p>
        </div>
      </div>
      
      <div className="p-12 border-2 border-dashed border-gray-200 rounded-lg text-center">
        <p className="text-gray-500 text-lg">Módulo de detalle y vista de derivaciones en construcción.</p>
      </div>
    </div>
  );
};

export default DetalleDocumento;
