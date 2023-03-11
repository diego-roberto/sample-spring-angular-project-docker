import { Directive, HostListener, Input, ElementRef, Renderer } from '@angular/core';
import { ControlValueAccessor, NgModel } from '@angular/forms';

@Directive({
    selector: '[dateMask]',
    providers: [NgModel]
})
export class DateMaskDirective implements ControlValueAccessor {
    onTouched: any;
    onChange: any;
    @Input() dateMask: string;

    constructor(public model: NgModel, private elRef: ElementRef, private renderer: Renderer) {
        renderer.setElementAttribute(this.elRef.nativeElement, 'maxLength', '10');
    }

    writeValue(value: any): void { }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    @HostListener('keyup', ['$event'])

    onKeyup($event: any) {
        // retorna caso pressionado backspace
        if ($event.keyCode === 8) {
        } else {
            let valor = $event.currentTarget.value.replace(/\D/g, '');
            const pad = this.dateMask.replace(/\D/g, '').replace(/9/g, '_');
            const valorMask = valor + pad.substring(0, pad.length - valor.length);
            let valorMaskPos = 0;
            valor = '';

            for (let i = 0; i < this.dateMask.length; i++) {
                if (isNaN(Number(this.dateMask.charAt(i)))) {
                    valor += this.dateMask.charAt(i);
                } else {
                    valor += valorMask[valorMaskPos++];
                }
            }
            if (valor.indexOf('_') > -1) {
                valor = valor.substr(0, valor.indexOf('_'));
            }
            $event.currentTarget.value = valor;
        }
    }
}
