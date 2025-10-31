import { useEffect, useState, useRef } from 'react';

import { useNavigate } from 'react-router';

type PointDay = {
  start?: string;
  lunch?: string;
  lunchEnd?: string;
  end?: string;
  hoursWorked?: string;
};

export default function Pontos() {
  const notificationTimeout = useRef<number | null>(null);
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

        // Notificação agendada para quando completar 08:00
        if (!data.hoursWorked) return;
        if (!("Notification" in window)) return;

        // Função para converter HH:MM para minutos
        const toMinutes = (h: string) => {
          const [hh, mm] = h.split(":").map(Number);
          return hh * 60 + mm;
        };
        const worked = toMinutes(data.hoursWorked);
        const target = 8 * 60;
        if (worked >= target) return;
        const faltaMin = target - worked;
        const faltaMs = faltaMin * 60 * 1000;

        // Limpa timeout anterior se houver
        if (notificationTimeout.current) {
          clearTimeout(notificationTimeout.current);
        }

        // Solicita permissão se necessário
        if (Notification.permission === "default") {
          Notification.requestPermission();
        }

        // Agenda notificação
        notificationTimeout.current = window.setTimeout(() => {
          if (Notification.permission === "granted") {
            new Notification('Você completou 08:00 horas trabalhadas! Considere bater o ponto.');
          }
        }, faltaMs);

      } catch (err: unknown) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPoint();
    // Removido o setInterval para atualização automática
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
              <span
                className={`text-xl font-bold ${point.hoursWorked && point.hoursWorked < '08:00'
                  ? 'text-orange-400'
                  : 'text-green-400'
                  }`}
              >
                {point.hoursWorked || '-'}
              </span>
            </div>
            {/* Mensagem removida conforme solicitado */}
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
                // Desabilita o botão durante a atualização, mas não mostra loading
                // Não altera setLoading aqui
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
              } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Erro desconhecido');
              }
            } catch (err: unknown) {
              setError(err instanceof Error ? err.message : 'Erro desconhecido');
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
        >
          {/* Não mostra ícone de loading durante atualização do ponto do dia */}
          Bater Ponto
        </button>
      </div>
    </div>
  );
}
