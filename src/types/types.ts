export interface PropertyProps {
    id:string,
title:string,
description:string,
price:number,
type:string,
bedrooms:number,
bathrooms:number,
area_sqm:number,
address:string,
city:string,
latitude:number,
longitude:number,
images:string[],
is_featured:boolean,
 is_sold:boolean,
created_at:string,
}

export interface AnimatedPropertyCardProps {
    item:PropertyProps;
    index:number;
    scrollY: any;
    itemHeight:number;
    scaleValues:number[];
    showDescription?:boolean;
    showArea?:boolean;
}