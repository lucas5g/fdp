import { useEffect, useState } from 'react';
import { CircleNotchIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router';

type PointDay = {
  start?: string;
  lunch?: string;
  lunchEnd?: string;
  end?: string;
  hoursWorked?: string;
};

export default function Pontos() {
  const navigate = useNavigate();
  const [point, setPoint] = useState<PointDay | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoint = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://fdp.dizelequefez.com.br/points/day', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        if (!response.ok) {
          throw new Error('Erro ao buscar pontos do dia');
        }
        const data = await response.json();
        setPoint(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPoint();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-3xl text-gray-100 font-bold mb-8">Bem-vindo ao Ponto!</h1>
      <div className="bg-linear-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-8 w-96 shadow-2xl">
        <h2 className="text-2xl text-blue-400 font-bold mb-6 text-center tracking-wide">Ponto do Dia</h2>
        {loading && <div className="text-gray-400 text-center">Carregando...</div>}
        {error && <div className="text-red-400 text-center">{error}</div>}
        {point && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Entrada:</span>
              <span className="text-lg text-gray-100 font-semibold">{point.start || '-'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Saída Almoço:</span>
              <span className="text-lg text-gray-100 font-semibold">{point.lunch || '-'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Volta Almoço:</span>
              <span className="text-lg text-gray-100 font-semibold">{point.lunchEnd || '-'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Saída:</span>
              <span className="text-lg text-gray-100 font-semibold">{point.end || '-'}</span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-700 pt-4 mt-2">
              <span className="text-gray-300 font-medium">Horas Trabalhadas:</span>
              <span className="text-xl text-green-400 font-bold">{point.hoursWorked || '-'}</span>
            </div>
          </div>
        )}
        <button
          className="mt-8 w-full bg-blue-700 text-white p-3 rounded hover:bg-blue-800 disabled:opacity-50 cursor-pointer font-semibold text-lg transition-colors duration-200 flex items-center justify-center gap-2"
          onClick={async () => {
            setLoading(true);
            try {
              const token = localStorage.getItem('token');
              const response = await fetch('https://fdp.dizelequefez.com.br/points', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': token ? `Bearer ${token}` : '',
                },
              });
              if (response.status === 401) {
                navigate('/login');
                return;
              }
              if (!response.ok) {
                throw new Error('Erro ao bater o ponto');
              }
              // Após bater o ponto, busca novamente o ponto do dia
              await response.json(); // ignora o retorno do POST
              try {
                const token = localStorage.getItem('token');
                const dayResponse = await fetch('https://fdp.dizelequefez.com.br/points/day', {
                  headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                  },
                });
                if (dayResponse.status === 401) {
                  navigate('/login');
                  return;
                }
                if (!dayResponse.ok) {
                  throw new Error('Erro ao buscar pontos do dia');
                }
                const dayData = await dayResponse.json();
                setPoint(dayData);
                setError('');
              } catch (err: any) {
                setError(err.message);
              }
            } catch (err: any) {
              setError(err.message);
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
        >
          {loading ? <CircleNotchIcon className="animate-spin" size={24} /> : null}
          Bater Ponto
        </button>
      </div>
    </div>
  );
}
