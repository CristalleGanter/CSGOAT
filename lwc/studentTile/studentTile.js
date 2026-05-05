import { LightningElement, api } from 'lwc';

export default class StudentTile extends LightningElement {
    @api isSelected = false; 
    @api student  = { 
        Name: 'Cristalle', 
        PhotoUrl: '/services/images/photo/003B0FakePictId', 
    };

    get tileSelected() { 
        return this.isSelected ? "tile selected" : "tile"; 
    } 

}