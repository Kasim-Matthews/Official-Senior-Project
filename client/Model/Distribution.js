class Distribution{
    constructor(partner, date, source, quantity, value, deliverymethod, comments){
        this.partner = partner;
        this.date = date;
        this.source = source;
        this.quantity = quantity;
        this.value = value;
        this.deliverymethod = deliverymethod;
        this.comments = comments;

        let currentDate = new Date();
        let givenDate = new Date(this.date);
        this.state = givenDate.getTime() < currentDate.getTime();
    }

    
}