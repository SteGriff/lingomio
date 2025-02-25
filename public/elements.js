var ElementFactory = function () {
    this.ab = "ab";
    this.gloss = "gloss";
    this.mnem = "mnem";
    this.usage = "usage";
    this.h1 = "h1";

    this.createElement = function (elementType, order, local, foreign) {
        const el = {
            "id": cuid(),
            "elementType": elementType,
            "order": order,
            "alignment": 0,
            "words": [this.createWord(local, foreign)]
        }
        console.log("createElement", el);
        return el;
    }

    this.createWord = function (local, foreign) {
        return {
            "id": cuid(),
            "local": local || "",
            "foreign": foreign || "",
            "phrase": "",
        }
    }

    this.initElements = function () {
        return [
            this.createElement(this.h1, 0, "Greetings"),
            this.createElement(this.gloss, 1, "Hello", "Hola")
        ]
    }

    this.initElementsExemplar = this.initElements();

    this.isUnchangedElements = function (elements) {
        // Check if there are the same number of elements as in initElements
        // and the content is the same as the init ones
        if (elements.length !== 2) return false;
        const initElems = this.initElementsExemplar;
        return elements.every((e, i) => {
            const initElem = initElems[i];
            return e.elementType === initElem.elementType
                && e.words[0].local === initElem.words[0].local
                && e.words[0].foreign === initElem.words[0].foreign;
        });
    }

    this.elementString = function (element) {
        return element.words
            .flatMap(w => this.wordString(w))
            .join('\r\n');
    }

    this.wordString = function (word) {
        const def = word.local
            ? ` - ${word.local}`
            : '';

        if (word.phrase)
            return `${word.phrase}${def}`;

        if (word.foreign)
            return `${word.foreign}${def}`;

        return word.local;
    }

    this.vocabString = function (word) {
        const baseString = this.wordString(word);
        if (word.usages) {
            const usageStrings = word.usages.map(u => u.phrase).join('\r\n');
            return [baseString, usageStrings].join('\r\n');
        }
        return baseString;
    }
}