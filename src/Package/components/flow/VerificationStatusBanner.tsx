import React, { useState } from 'react';
import { ChevronDown, ChevronUp, XCircle, CheckCircle, Clock } from 'lucide-react';

type VerificationStatus = 'pending' | 'rejected' | 'verified';

interface StatusCardProps {
  status: VerificationStatus;
  isActive: boolean;
}
interface VerificationStatusProps {
  status: 'pending' | 'rejected' | 'verified';
  userEmail: string;
  onDismiss: () => void;
}


const StatusCard: React.FC<StatusCardProps> = ({ status, isActive }) => {
  const config = {
    pending: {
      title: 'Pending',
      icon: <Clock className="w-5 h-5" />,
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/40',
      textColor: 'text-yellow-300',
      iconColor: 'text-yellow-400'
    },
    rejected: {
      title: 'Rejected',
      icon: <XCircle className="w-5 h-5" />,
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/40',
      textColor: 'text-red-300',
      iconColor: 'text-red-400'
    },
    verified: {
      title: 'Accepted',
      icon: <CheckCircle className="w-5 h-5" />,
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/40',
      textColor: 'text-green-300',
      iconColor: 'text-green-400'
    }
  };

  const currentConfig = config[status];

  return (
    <div className={`p-4  rounded-lg border-2 ${currentConfig.borderColor} ${currentConfig.bgColor} ${
      isActive ? 'opacity-100' : 'opacity-60'
    }`}>
      <div className={`w-12 h-12 rounded-full ${currentConfig.bgColor} border-2 ${currentConfig.borderColor} flex items-center justify-center mb-3`}>
        <span className={currentConfig.iconColor}>
          {currentConfig.icon}
        </span>
      </div>

      <h3 className={`text-lg font-bold ${currentConfig.textColor}`}>
        {currentConfig.title}
      </h3>
    </div>
  );
};

const VerificationStatusComponent: React.FC<VerificationStatusProps> = ({
 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<VerificationStatus>('pending');

  const statuses: VerificationStatus[] = ['rejected', 'verified', 'pending'];

  return (
    <div className="w-full max-w-md relative translate-x-[-50%] left-[50%]">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 rounded-xl bg-linear-to-r from-[#b68938]/20 to-[#e1ba73]/20 border-2 border-[#b68938]/40 text-[#e1ba73] font-bold text-lg uppercase flex items-center justify-between mb-4 hover:shadow-[0_0_30px_rgba(182,137,56,0.3)] transition-all"
      >
        <span>Verification Status</span>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {isExpanded && (
        <>
          <div className="space-y-4">
            {statuses.map((status) => (
              <StatusCard
                key={status}
                status={status}
                isActive={currentStatus === status}
              />
            ))}
          </div>

          <button
            onClick={() => {
              const nextStatus = currentStatus === 'rejected' ? 'verified' : 
                                currentStatus === 'verified' ? 'pending' : 'rejected';
              setCurrentStatus(nextStatus);
            }}
            className="w-full px-6 py-3 rounded-lg bg-linear-to-r from-[#b68938] to-[#e1ba73] text-black font-bold text-lg uppercase mt-6 hover:shadow-[0_0_30px_rgba(182,137,56,0.5)] transition-all"
          >
            Set Status
          </button>
        </>
      )}
    </div>
  );
};

export default VerificationStatusComponent;