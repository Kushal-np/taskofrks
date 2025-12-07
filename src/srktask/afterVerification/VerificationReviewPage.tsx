import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  RefreshCw,
  
  Shield,
  Loader2,
  Info
} from 'lucide-react';

// Types
type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'processing';

interface VerificationReviewPageProps {
  userEmail: string;
  expectedReviewTime: string;
  status?: VerificationStatus;
  rejectionReason?: string;
  submittedDate?: string;
  estimatedCompletion?: string;
}

// Reusable Components (copied from your theme)
const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}> = ({ children, className = '', hover = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 ${hover ? 'hover:border-white/20 transition-all duration-300' : ''} ${className}`}
      style={{
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#b68938]/10 via-[#b68938]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

const GradientText: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <motion.span
      className={`bg-clip-text text-transparent font-bold ${className}`}
      style={{ 
        backgroundImage: 'linear-gradient(135deg, #b68938 0%, #e1ba73 100%)',
        WebkitBackgroundClip: 'text'
      }}
      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      transition={{ duration: 5, repeat: Infinity }}
    >
      {children}
    </motion.span>
  );
};

const StatusBadge: React.FC<{ status: string; pulse?: boolean }> = ({ status, pulse = false }) => {
  const getConfig = () => {
    switch (status) {
      case 'Approved':
      case 'Verified':
        return { 
          bg: 'bg-emerald-500/10', 
          text: 'text-emerald-400', 
          border: 'border-emerald-500/20',
          icon: <CheckCircle size={12} />
        };
      case 'Rejected':
        return { 
          bg: 'bg-rose-500/10', 
          text: 'text-rose-400', 
          border: 'border-rose-500/20',
          icon: <XCircle size={12} />
        };
      case 'Processing':
        return { 
          bg: 'bg-amber-500/10', 
          text: 'text-amber-400', 
          border: 'border-amber-500/20',
          icon: <Loader2 size={12} className="animate-spin" />
        };
      default:
        return { 
          bg: 'bg-zinc-500/10', 
          text: 'text-zinc-400', 
          border: 'border-zinc-500/20',
          icon: <Clock size={12} />
        };
    }
  };

  const config = getConfig();
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        boxShadow: pulse ? ['0 0 0 0 rgba(245, 158, 11, 0.7)', '0 0 0 10px rgba(245, 158, 11, 0)'] : 'none'
      }}
      transition={{ 
        duration: 0.3,
        boxShadow: pulse ? { repeat: Infinity, duration: 1.5 } : {}
      }}
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border} backdrop-blur-sm`}
    >
      {config.icon}
      {status}
    </motion.span>
  );
};

// Main Component
const VerificationReviewPage: React.FC<VerificationReviewPageProps> = ({
  userEmail,
  expectedReviewTime,
  status = 'processing',
  rejectionReason,
  submittedDate = new Date().toLocaleDateString(),
  estimatedCompletion
}) => {
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  
  // Simulate time updates
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const reviewDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
      const diff = reviewDate.getTime() - now.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else if (minutes > 0) {
        setTimeRemaining(`${minutes}m`);
      } else {
        setTimeRemaining('Less than 1 minute');
      }
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    switch (status) {
      case 'approved':
        return {
          icon: CheckCircle,
          color: 'text-emerald-400',
          bgGradient: 'from-emerald-500/20 to-green-500/20',
          title: 'Verification Approved',
          message: 'Your identity has been successfully verified.',
          nextSteps: 'You can now access all earning features.',
          pulse: false
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-rose-400',
          bgGradient: 'from-rose-500/20 to-red-500/20',
          title: 'Verification Rejected',
          message: 'Your documents did not meet our verification standards.',
          nextSteps: 'Please review the rejection reason below.',
          pulse: false
        };
      case 'processing':
        return {
          icon: Loader2,
          color: 'text-amber-400',
          bgGradient: 'from-amber-500/20 to-yellow-500/20',
          title: 'Verification in Progress',
          message: 'Your documents are being reviewed by our compliance team.',
          nextSteps: 'You will be notified once the review is complete.',
          pulse: true
        };
      default: // pending
        return {
          icon: Clock,
          color: 'text-blue-400',
          bgGradient: 'from-blue-500/20 to-cyan-500/20',
          title: 'Verification Submitted',
          message: 'Thank you! Your documents have been successfully submitted.',
          nextSteps: 'Our team will review them shortly.',
          pulse: true
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1410] to-[#0a0a0a]" />
        
        {/* Animated orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-1/4 w-96 h-96 bg-[#b68938]/10 rounded-full blur-[128px]"
        />
        
        {/* Grid lines */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-[#b68938]/10 to-transparent"
              style={{ top: `${i * 5}%` }}
              animate={{
                opacity: [0.05, 0.15, 0.05],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
            <GradientText>
              Verification Status
            </GradientText>
          </h1>
          <p className="text-zinc-400 text-lg">
            Track your verification progress
          </p>
        </motion.div>

        {/* Main Status Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8"
        >
          <GlassCard className="relative overflow-hidden">
            {/* Status indicator bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.bgGradient}`} />
            
            <div className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Status Icon */}
                <motion.div
                  animate={status === 'processing' ? { rotate: 360 } : {}}
                  transition={status === 'processing' ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
                  className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${config.bgGradient} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon size={48} className={config.color} />
                </motion.div>
                
                {/* Status Details */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {config.title}
                      </h2>
                      <StatusBadge 
                        status={
                          status === 'approved' ? 'Approved' :
                          status === 'rejected' ? 'Rejected' :
                          status === 'processing' ? 'Processing' :
                          'Pending Review'
                        } 
                        pulse={config.pulse}
                      />
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-zinc-400">Submitted On</div>
                      <div className="text-white font-medium">{submittedDate}</div>
                    </div>
                  </div>
                  
                  <p className="text-zinc-300 mb-6">
                    {config.message}
                  </p>
                  
                  {/* Rejection Reason */}
                  {status === 'rejected' && rejectionReason && (
                    <div className="mb-6 p-4 bg-rose-500/10 rounded-xl border border-rose-500/20">
                      <div className="flex items-start gap-3">
                        <AlertTriangle size={20} className="text-rose-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-bold text-rose-400 mb-1">Rejection Reason</h4>
                          <p className="text-white">{rejectionReason}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Processing Progress */}
                  {status === 'processing' && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between text-sm text-zinc-400 mb-2">
                        <span>Review Progress</span>
                        <span>{timeRemaining} remaining</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-amber-500 to-yellow-500"
                          initial={{ width: '30%' }}
                          animate={{ width: ['30%', '70%', '30%'] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Next Steps */}
                  <div className="p-4 bg-white/5 rounded-xl">
                    <h4 className="font-medium text-white mb-2">Next Steps:</h4>
                    <p className="text-zinc-300 text-sm">{config.nextSteps}</p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Timeline & Details Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Timeline */}
          <GlassCard>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Clock size={20} className="text-amber-400" />
                Verification Timeline
              </h3>
              
              <div className="space-y-6 relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/10" />
                
                {[
                  { step: 1, label: 'Documents Submitted', status: 'completed', time: 'Just now' },
                  { step: 2, label: 'Initial Review', status: status === 'pending' ? 'current' : 'completed', time: 'In progress' },
                  { step: 3, label: 'Compliance Check', status: ['processing', 'approved', 'rejected'].includes(status) ? 'completed' : 'pending', time: expectedReviewTime },
                  { step: 4, label: status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected' : 'Final Review', status: ['approved', 'rejected'].includes(status) ? 'completed' : 'pending', time: 'Estimated soon' },
                ].map((item) => (
                  <div key={item.step} className="relative flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                      item.status === 'completed' ? 'bg-emerald-500/20 border border-emerald-500/30' :
                      item.status === 'current' ? 'bg-amber-500/20 border border-amber-500/30' :
                      'bg-zinc-800 border border-white/10'
                    }`}>
                      {item.status === 'completed' ? (
                        <CheckCircle size={20} className="text-emerald-400" />
                      ) : item.status === 'current' ? (
                        <Loader2 size={20} className="text-amber-400 animate-spin" />
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-zinc-600" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-white">{item.label}</p>
                          <p className="text-sm text-zinc-400 mt-1">{item.time}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                          item.status === 'current' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-zinc-800 text-zinc-400'
                        }`}>
                          {item.status === 'completed' ? 'Completed' :
                           item.status === 'current' ? 'In Progress' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Details Card */}
          <GlassCard>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Info size={20} className="text-blue-400" />
                Verification Details
              </h3>
              
              <div className="space-y-6">
                {/* Email Notification */}

                
                {/* Estimated Time */}
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                  <Clock size={20} className="text-amber-400" />
                  <div>
                    <p className="text-sm text-zinc-400">Estimated Review Time</p>
                    <p className="text-white font-medium">{expectedReviewTime}</p>
                  </div>
                </div>
                
                {/* Status Info */}
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                  <Shield size={20} className="text-purple-400" />
                  <div>
                    <p className="text-sm text-zinc-400">Verification Level</p>
                    <p className="text-white font-medium">Standard Identity Verification</p>
                  </div>
                </div>
                
                {/* Actions based on status */}
                <div className="mt-6">
                  {status === 'rejected' ? (
                    <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                      <RefreshCw size={16} />
                      Resubmit Documents
                    </button>
                  ) : status === 'approved' ? (
                    <button className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity">
                      Go to Dashboard
                    </button>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm text-zinc-400 mb-3">
                        You will receive an email notification once the review is complete.
                      </p>
                      <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity">
                        Check Status Later
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-8"
        >
          <GlassCard>
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Need Help?</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-white/5 rounded-xl">
                  <h4 className="font-medium text-white mb-2">Email Support</h4>
                  <p className="text-sm text-zinc-400">support@srkportal.com</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <h4 className="font-medium text-white mb-2">Response Time</h4>
                  <p className="text-sm text-zinc-400">24-48 hours</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <h4 className="font-medium text-white mb-2">Working Hours</h4>
                  <p className="text-sm text-zinc-400">Mon-Fri, 9AM-6PM</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-zinc-500">
            This is an automated verification system. For any discrepancies, contact our support team.
          </p>
        </motion.div>
      </div>

      {/* Floating shield animation */}
      <motion.div
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="fixed bottom-10 right-10 opacity-10 pointer-events-none"
      >
        <Shield size={60} className="text-amber-400" />
      </motion.div>


    </div>
  );
};

export default VerificationReviewPage;