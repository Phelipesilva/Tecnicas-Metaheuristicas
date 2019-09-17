class Item {

    constructor(id, peso, beneficio) {
        this.id = parseInt(id)
        this.peso = parseFloat(peso)
        this.beneficio = parseFloat(beneficio)
    }    
}

class Mochila {

    constructor(capacidade) {
        this.capacidade = parseInt(capacidade)
        this.items = []
        this.peso = 0
        this.beneficio = 0
    }

    inserirItems(items) {

        // beneficio dos items a serem adicionados
        const penalidade = items.reduce((total, item) => {
            total += item.beneficio
            return total
        }, 0)
        
        const vizinhos = Solucao.gerarSolucaoAleatoria(items.length)
        const s = new Solucao(vizinhos, items, penalidade, this.capacidade)

        const melhor = Solucao.buscaLocal(s, items, penalidade, this.capacidade, Math.floor(items.length/6))
        this.items = melhor.items
        this.peso = melhor.peso
        this.beneficio = melhor.beneficio
    }
}

class Solucao {

    constructor(vizinhos, items, penalidade, b) {
        this.peso = 0
        this.beneficio = 0
        this.fs = 0
        this.vizinhos = vizinhos
        this.items = items.filter((item, index) => (
            vizinhos[index] === '1'
        ))
        this.calcularAvaliacao(penalidade, b)
    }

    calcularAvaliacao(penalidade, b) {
        
        this.peso = 0
        this.beneficio = 0

        this.items.forEach(({peso, beneficio}) => {
            this.peso += peso
            this.beneficio += beneficio
        })
        
        const aux = this.peso - b
        const max = aux > 0 ? aux : 0
        this.fs = this.beneficio - penalidade * max
    }

    static gerarSolucaoAleatoria(n) {
        const max = Math.pow(2, n) - 1
        const aleatorio = Math.floor(Math.random() * (max))
        const bin = Math.round(Math.random() * (1)).toString()
        return aleatorio.toString(2).padStart(n, bin).split('')
    }

    static ordenarFs(solucoes) {
        return solucoes.sort((a, b) => (
            b.fs - a.fs
        ))
    }

    static aprimorarSolucao(anterior, items, penalidade, b, tabu=[]) {
        // calcula vizinhos de s
        const solucoes = anterior.vizinhos.map((bit, index) => {
            // Movimentando
            let vizinhos = [...anterior.vizinhos]
            vizinhos[index] = bit === '0' ? '1' : '0'
            return new Solucao(vizinhos, items, penalidade, b)
        })
        const melhores = Solucao.ordenarFs(solucoes)
        const atual = Solucao.verificarTabu(melhores, tabu)

        if(atual) {
            tabu.push(atual)
        }

        // Maximizou o resultado ?
        return atual && atual.fs > anterior.fs 
            ? Solucao.aprimorarSolucao(atual, items, penalidade, b)
            : anterior 
    }

    static verificarTabu(solucoes, tabu) {
        
        // Busca Primeira solução que ainda não existe na lista tabu
        return solucoes.find(solucao => (
            !tabu.find(({vizinhos}) => (
                vizinhos.toString() === solucao.vizinhos.toString()
            ))
        ))
    }

    static buscaLocal(anterior, items, penalidade, b, T, tabu=[], melhor=null) {

        const solucao = Solucao.aprimorarSolucao(anterior, items, penalidade, b, tabu)

        melhor = melhor && melhor.fs > solucao.fs ? melhor : solucao

        return tabu.length > T 
            ? melhor
            : this.buscaLocal(melhor, items, penalidade, b, T, tabu, melhor)
    }
}