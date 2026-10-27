'use client';

import { CadastroForm } from '../../nova/nova-paciente-form';
import type { EdicaoFichaInput } from '../../../../lib/pacientes.schema';

export default function EditarFichaForm({ inicial }: { inicial: EdicaoFichaInput }) {
  return <CadastroForm modo="editar" inicial={inicial} />;
}
