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
        const melhor = Solucao.simulatedAnnealing(items, penalidade, this.capacidade)
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
        this.penalidade = penalidade
        this.b = b
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

    aleatorio() {
        const rand = Math.random()
        const index = Math.floor(rand * (this.vizinhos.length-1))
        let vizinhos = [...this.vizinhos]
        vizinhos[index] = Math.floor(rand).toString()
        return new Solucao(vizinhos, this.items, this.penalidade, this.b);
    }

    static gerarSolucaoAleatoria(n) {
        const max = Math.pow(2, n) - 1
        const aleatorio = Math.floor(Math.random() * (max))
        const bin = Math.round(Math.random()).toString()
        return aleatorio.toString(2).padStart(n, bin).split('')
    }

    static simulatedAnnealing(items, penalidade, b, T0=100, a=0.005, SAmax=5) {
        
        let s = new Solucao(Solucao.gerarSolucaoAleatoria(items.length), items, penalidade, b)
        let melhor = s
        let i = 0
        let t = T0
        
        while (t > 0) {
            while(i < SAmax) {
                i += 1
                let si = s.aleatorio()
                const diff = si.fs - s.fs
                if(diff > 0) {
                    s = si
                    if(si.fs > melhor.fs) {
                        melhor = si
                    }
                } else {
                    const rand = Math.random()
                    if(rand < Math.exp(-diff/t)) {
                        s = si
                    }
                }
            }
            t = a * t
            i = 0
        }

        return melhor
    }
}