
"use client";

import { useEffect, useState } from "react";

type Tarefa = {
  id: number;
  texto: string;
  concluida: boolean;
};

export default function Home() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [novaTarefa, setNovaTarefa] = useState("");
  const [filtro, setFiltro] = useState("todas");
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    const salvas = localStorage.getItem("minhas-tarefas");
    if (salvas) setTarefas(JSON.parse(salvas));
    setCarregado(true);
  }, []);

  useEffect(() => {
    if (carregado) {
      localStorage.setItem("minhas-tarefas", JSON.stringify(tarefas));
    }
  }, [tarefas, carregado]);

  function adicionarTarefa(e: React.FormEvent) {
    e.preventDefault();
    if (!novaTarefa.trim()) return;

    setTarefas([
      ...tarefas,
      {
        id: Date.now(),
        texto: novaTarefa.trim(),
        concluida: false,
      },
    ]);

    setNovaTarefa("");
  }

  function alterarStatus(id: number) {
    setTarefas(
      tarefas.map((t) =>
        t.id === id ? { ...t, concluida: !t.concluida } : t
      )
    );
  }

  function excluirTarefa(id: number) {
    setTarefas(tarefas.filter((t) => t.id !== id));
  }

  const pendentes = tarefas.filter((t) => !t.concluida).length;
  const concluidas = tarefas.filter((t) => t.concluida).length;

  const tarefasFiltradas = tarefas.filter((t) => {
    if (filtro === "pendentes") return !t.concluida;
    if (filtro === "concluidas") return t.concluida;
    return true;
  });

  return (
    <main className="container">
      <header className="header">
        <div className="header-icon">✓</div>
        <div>
          <span className="subtitulo">ORGANIZAÇÃO PESSOAL</span>
          <h1>Minhas Tarefas</h1>
          <p>Organize suas atividades e aproveite melhor seu dia.</p>
        </div>
      </header>

      <section className="resumo">
        <div className="card total">
          <span>Total de tarefas</span>
          <strong>{tarefas.length}</strong>
          <small>Tarefas cadastradas</small>
        </div>

        <div className="card pendente">
          <span>Pendentes</span>
          <strong>{pendentes}</strong>
          <small>Aguardando conclusão</small>
        </div>

        <div className="card concluido">
          <span>Concluídas</span>
          <strong>{concluidas}</strong>
          <small>Atividades finalizadas</small>
        </div>
      </section>

      <section className="painel">
        <div className="titulo-painel">
          <div>
            <h2>Minhas atividades</h2>
            <p>Adicione e acompanhe suas tarefas.</p>
          </div>
          <span className="contador">{tarefas.length} itens</span>
        </div>

        <form onSubmit={adicionarTarefa} className="formulario">
          <input
            type="text"
            placeholder="O que você precisa fazer hoje?"
            value={novaTarefa}
            onChange={(e) => setNovaTarefa(e.target.value)}
          />
          <button type="submit">+ Adicionar tarefa</button>
        </form>

        <div className="filtros">
          <button
            className={filtro === "todas" ? "ativo" : ""}
            onClick={() => setFiltro("todas")}
          >
            Todas <span>{tarefas.length}</span>
          </button>

          <button
            className={filtro === "pendentes" ? "ativo" : ""}
            onClick={() => setFiltro("pendentes")}
          >
            Pendentes
          </button>

          <button
            className={filtro === "concluidas" ? "ativo" : ""}
            onClick={() => setFiltro("concluidas")}
          >
            Concluídas
          </button>
        </div>

        <div className="lista">
          {tarefasFiltradas.length === 0 ? (
            <div className="vazio">
              <div className="vazio-icon">☑</div>
              <h3>Nenhuma tarefa por aqui</h3>
              <p>
                {filtro === "todas"
                  ? "Adicione sua primeira tarefa para começar."
                  : "Não existem tarefas neste filtro."}
              </p>
            </div>
          ) : (
            tarefasFiltradas.map((tarefa) => (
              <div className="tarefa" key={tarefa.id}>
                <label className="tarefa-info">
                  <input
                    type="checkbox"
                    checked={tarefa.concluida}
                    onChange={() => alterarStatus(tarefa.id)}
                  />
                  <span className={tarefa.concluida ? "riscada" : ""}>
                    {tarefa.texto}
                  </span>
                </label>

                <button
                  className="excluir"
                  onClick={() => excluirTarefa(tarefa.id)}
                  title="Excluir tarefa"
                >
                  Excluir
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <footer>
        <span>Minhas Tarefas</span>
        <span>Organize seu dia com simplicidade.</span>
      </footer>
    </main>
  );
}
