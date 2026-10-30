namespace catfood;

using { cuid, managed } from '@sap/cds/common';


entity Products : cuid, managed {    
    name        : String(100) not null;
    description : String(255);
    flavor      : String(60);
    weightInKg  : Decimal(5,2);
    price       : Decimal(9,2) not null;
    currency    : String(3) default 'USD';
    stock       : Integer default 0;
}
