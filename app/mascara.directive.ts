import { Directive, ElementRef, forwardRef, Input, NgModule, OnInit, Renderer } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms'
import { createTextMaskInputElement } from 'text-mask-core/dist/textMaskCore'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

/// Example:
/// <input mascara="telefone" [(ngModel)]="model" type="text" class="form-control"/> (##) #####-####
/// <input mascara="cep" [(ngModel)]="model" type="text" class="form-control"/> #####-##
/// <input mascara="cpf" [(ngModel)]="model" type="text" class="form-control"/> ###.###.###-##
/// <input mascara="cnpj" [(ngModel)]="model" type="text" class="form-control"/> ##.###.###/####-##
/// <input mascara="numero" [(ngModel)]="model" type="text" class="form-control"/> apenas números
/// <input mascara="decimal" [(ngModel)]="model" type="text" class="form-control"/> #####,##

@Directive({
    host: {
        '(input)': 'onInput($event)',
        '(blur)': '_onTouched()'
    },
    selector: '[mascara]',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => MascaraDirective),
        multi: true
    }]
})
export class MascaraDirective implements OnInit, ControlValueAccessor {
    private textMaskInputElement: any
    private inputElement: HTMLInputElement

    // stores the last value for comparison
    private lastValue: any

    private _mask: Array<string | RegExp>;
    private _guide: boolean = true;
    private _placeholderChar: string = '_';
    private _pipe: any = undefined;
    private _keepCharPositions: boolean = false;
    private _onReject: any = undefined;
    private _onAccept: any = undefined;

    @Input('mascara') mascara: string;
    @Input('mascara-decimal') mascara_decimal: any;

    public textMaskConfig = {
        mask: null,
        guide: true,
        placeholderChar: '_',
        pipe: undefined,
        keepCharPositions: false,
        onReject: undefined,
        onAccept: undefined
    }

    _onTouched = () => { }
    _onChange = (_: any) => { }

    constructor(private renderer: Renderer, private element: ElementRef) { }

    ngOnInit() {
        switch (this.mascara) {
            case 'telefone':
                this._mask = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
                this._guide = false;
                break;
            case 'numero':
                this._mask = createNumberMask({
                    prefix: '',
                    suffix: '',
                    includeThousandsSeparator: false,
                    allowDecimal: false
                })
                this._guide = false;
                this._keepCharPositions = true;
                break;
            case 'decimal':
                this._mask = createNumberMask({
                    prefix: '',
                    suffix: '',
                    thousandsSeparatorSymbol: '.',
                    decimalSymbol: ',',
                    allowDecimal: true,
                    requireDecimal: false,
                    decimalLimit: this.mascara_decimal ? parseInt(this.mascara_decimal) : 2,
                })
                this._guide = false;
                this._keepCharPositions = false;
                this.renderer.setElementStyle(this.element.nativeElement, 'text-align', 'right');
                break;
            case 'cpf':
                this._mask = [/[1-9]/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
                this._guide = false;
                break;
            case 'cep':
                this._mask = [/[1-9]/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
                this._guide = false;
                break;
            case 'cnpj':
                this._mask = [/[1-9]/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/,];
                this._guide = false;
                break;
        }

        this.textMaskConfig.mask = this._mask;
        this.textMaskConfig.guide = this._guide;
        this.textMaskConfig.keepCharPositions = this._keepCharPositions;

        if (this.element.nativeElement.tagName === 'INPUT')
            this.inputElement = this.element.nativeElement
        else
            this.inputElement = this.element.nativeElement.getElementsByTagName('INPUT')[0]


        this.textMaskInputElement = createTextMaskInputElement(
            Object.assign({ inputElement: this.inputElement }, this.textMaskConfig)
        )
    }

    writeValue(value: any) {
        if (this.textMaskInputElement !== undefined)
            this.textMaskInputElement.update(value)
    }

    registerOnChange(fn: (value: any) => any): void { this._onChange = fn }

    registerOnTouched(fn: () => any): void { this._onTouched = fn }

    onInput($event) {
        this.textMaskInputElement.update($event.target.value)

        if (this.lastValue !== $event.target.value) {
            this.lastValue = $event.target.value
            this._onChange($event.target.value)
        }
    }

    setDisabledState(isDisabled: boolean) {
        this.renderer.setElementProperty(this.element.nativeElement, 'disabled', isDisabled)
    }
}