class Item {

    constructor(id, peso, beneficio) {
        this.id = parseInt(id);
        this.peso = parseFloat(peso);
        this.beneficio = parseFloat(beneficio);
        this.relevancia = beneficio/peso;
    }    
}

class Mochila {

    constructor(capacidade) {
        this.capacidade = parseInt(capacidade);
        this.items = [];
        this.peso = 0;
    }

    adicionarItem(item) {
        if(this.peso + item.peso <= this.capacidade) {
            this.items.push(item)
            this.peso += item.peso;
        }
    }

    inserirItems(items) {
        this.items = [];
        this.peso = 0;
        const ordernados = this.ordenarPorRelevancia(items);

        ordernados.forEach(item => {
            this.adicionarItem(item);
        });
    }

    ordenarPorRelevancia(items) {
        return items.sort((a, b) => (
            b.relevancia - a.relevancia
        ));
    }
}