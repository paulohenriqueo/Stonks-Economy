'use client';

import { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

import { auth } from "@/lib/firebaseClient";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (data: { name: string; email: string; password: string }) => void;
}

export function RegisterModal({ isOpen, onClose, onRegister }: RegisterModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirme sua senha';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (validateForm()) {
    try {
      // Tenta criar o usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      console.log("Usuário cadastrado:", user.uid);
      
      // Aqui você pode, opcionalmente, salvar dados extras (como o nome) no Firestore

      onRegister({ name: formData.name, email: formData.email, password: formData.password }); // Fecha o modal
      onClose();
    } catch (error) {
      console.error("Erro no cadastro:", error);
      // Trate os erros (ex: email já em uso, senha fraca)
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/email-already-in-use') {
            alert('Este e-mail já está em uso.');
        } else {
            alert('Erro ao cadastrar. Tente novamente.');
        }
      } else {
          alert('Erro desconhecido.');
      }
    }
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-gray-900 rounded-2xl shadow-xl w-full max-w-md mx-4 transform transition-all border border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-semibold text-white">
            Criar conta
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nome completo
            </label>
            <div className="relative">
              <User className="absolute left-4 inset-y-0 my-auto w-5 h-5 text-gray-500" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-gray-800 text-white ${
                  errors.name 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-600 focus:ring-blue-500'
                }`}
                placeholder="Seu nome"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3 inset-y-0 my-auto w-5 h-5 text-gray-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-gray-800 text-white ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-600 focus:ring-blue-500'
                }`}
                placeholder="seu@email.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 inset-y-0 my-auto w-5 h-5 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-gray-800 text-white ${
                  errors.password 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-600 focus:ring-blue-500'
                }`}
                placeholder="••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 inset-y-0 my-auto text-gray-500 hover:text-gray-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirmar senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 inset-y-0 my-auto w-5 h-5 text-gray-500" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-gray-800 text-white ${
                  errors.confirmPassword 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-600 focus:ring-blue-500'
                }`}
                placeholder="••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 inset-y-0 my-auto text-gray-500 hover:text-gray-400"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="space-y-3 pt-4">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Criar conta
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 px-4 border border-gray-600 text-gray-300 font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}