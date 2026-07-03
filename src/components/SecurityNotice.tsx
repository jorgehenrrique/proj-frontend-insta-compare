export function SecurityNotice() {
  return (
    <section className="flex gap-3 rounded-2xl border border-amber-300/60 bg-amber-50 px-5 py-4 dark:border-amber-900/50 dark:bg-amber-950/30">
      <span className="text-xl" aria-hidden="true">
        🔒
      </span>
      <div className="text-sm text-ink">
        <p className="font-semibold">Este site é seguro e não guarda nem compartilha seus dados</p>
        <p className="mt-1 text-ink-muted">
          Tudo acontece no seu navegador: os arquivos que você envia aqui nunca são enviados para
          nenhum servidor. Nada é salvo, nada é compartilhado.
        </p>
        <p className="mt-2 text-ink-muted">
          <strong className="text-ink">Cuidado:</strong> desconfie de sites e apps
          de terceiros que pedem o seu usuário e senha do Instagram para "mostrar quem não te
          segue de volta". Isso é uma prática insegura e comum em golpes de phishing — pode expor
          sua conta a roubo. Esta ferramenta nunca pede login: ela só lê o arquivo oficial que
          você mesmo exporta pelo app do Instagram.
        </p>
      </div>
    </section>
  );
}
