import {NgModule} from "@angular/core";
import {MbScroll} from './scroll';

const DECLARATIONS = [
    MbScroll
];

@NgModule({
    declarations: [
        ...DECLARATIONS,
    ],
    exports: [
        ...DECLARATIONS
    ],
    imports: []
})
export class MbScrollModule {}
