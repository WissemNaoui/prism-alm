import React, { useEffect, useState } from "react";
import { useAuthStore } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/DashboardLayout";
import { DashboardCard } from "../components/DashboardCard";
import { Button } from "../components/Button";
import { AccountTable } from "../components/AccountTable";
import { AccountForm } from "../components/AccountForm";
import { AccountDetails } from "../components/AccountDetails";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Account, useAccountStore } from "../utils/accountStore";
import { toast } from "sonner";

export default function AccountManagement() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { accounts, addAccount, updateAccount, deleteAccount } = useAccountStore();
  
  // UI state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Handle account creation
  const handleCreateAccount = async (accountData: Omit<Account, 'id' | 'accountNumber'>) => {
    setIsSubmitting(true);
    try {
      addAccount(accountData);
      setIsCreateModalOpen(false);
      toast.success('Account created successfully');
    } catch (error) {
      toast.error('Failed to create account');
      console.error('Error creating account:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle account update
  const handleUpdateAccount = async (accountData: Omit<Account, 'id' | 'accountNumber'>) => {
    if (!selectedAccount) return;
    
    setIsSubmitting(true);
    try {
      const updatedAccount = {
        ...selectedAccount,
        ...accountData
      };
      updateAccount(updatedAccount);
      setIsEditModalOpen(false);
      toast.success('Account updated successfully');
    } catch (error) {
      toast.error('Failed to update account');
      console.error('Error updating account:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!selectedAccount) return;
    
    try {
      deleteAccount(selectedAccount.id);
      setIsDeleteModalOpen(false);
      toast.success('Account deleted successfully');
    } catch (error) {
      toast.error('Failed to delete account');
      console.error('Error deleting account:', error);
    }
  };

  // Open view modal
  const handleViewAccount = (account: Account) => {
    setSelectedAccount(account);
    setIsViewModalOpen(true);
  };

  // Open edit modal
  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account);
    setIsEditModalOpen(true);
  };

  // Open delete confirmation
  const handleDeletePrompt = (account: Account) => {
    setSelectedAccount(account);
    setIsDeleteModalOpen(true);
  };

  // Close all modals
  const closeAllModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedAccount(null);
  };

  return (
    <DashboardLayout title="Account Management">
      <div className="grid grid-cols-1 gap-6">
        <DashboardCard
          title="Accounts Overview"
          subtitle="Manage your financial institution's accounts"
          action={
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Account
            </Button>
          }
        >
          <AccountTable 
            accounts={accounts}
            onView={handleViewAccount}
            onEdit={handleEditAccount}
            onDelete={handleDeletePrompt}
          />
        </DashboardCard>
      </div>
      
      {/* Create Account Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Create New Account</h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <AccountForm 
                onSubmit={handleCreateAccount} 
                onCancel={() => setIsCreateModalOpen(false)}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Account Modal */}
      {isEditModalOpen && selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Edit Account</h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <AccountForm 
                account={selectedAccount}
                onSubmit={handleUpdateAccount} 
                onCancel={() => setIsEditModalOpen(false)}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* View Account Modal */}
      {isViewModalOpen && selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden">
            <div className="p-6">
              <AccountDetails 
                account={selectedAccount}
                onEdit={() => {
                  setIsViewModalOpen(false);
                  setIsEditModalOpen(true);
                }}
                onClose={() => setIsViewModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <ConfirmDialog
              title="Delete Account"
              message={`Are you sure you want to delete the account "${selectedAccount.accountName}"? This action cannot be undone.`}
              confirmLabel="Delete"
              onConfirm={handleDeleteAccount}
              onCancel={() => setIsDeleteModalOpen(false)}
              isDestructive={true}
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
