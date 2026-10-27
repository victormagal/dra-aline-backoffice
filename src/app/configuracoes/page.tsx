import AbasConfiguracoes from './abas';
import ConfiguracoesForm from './configuracoes-form';
import { FORM_CONFIGURACOES } from '../../lib/configuracoes.data';
import styles from './configuracoes.module.css';

export default function ConfiguracoesPage() {
  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>CONFIGURAÇÕES</p>
          <h1>Configurações</h1>
        </div>
        <div className={styles.actions}>
          <button type="submit" form={FORM_CONFIGURACOES} className={styles.primary}>Salvar alterações</button>
        </div>
      </header>
      <AbasConfiguracoes ativa="formularios" />
      <ConfiguracoesForm />
    </>
  );
}
