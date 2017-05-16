"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var textMaskCore_1 = require("text-mask-core/dist/textMaskCore");
var createNumberMask_1 = require("text-mask-addons/dist/createNumberMask");
/// Example:
/// <input mascara="telefone" [(ngModel)]="model" type="text" class="form-control"/> (##) #####-####
/// <input mascara="cep" [(ngModel)]="model" type="text" class="form-control"/> #####-##
/// <input mascara="cpf" [(ngModel)]="model" type="text" class="form-control"/> ###.###.###-##
/// <input mascara="cnpj" [(ngModel)]="model" type="text" class="form-control"/> ##.###.###/####-##
/// <input mascara="numero" [(ngModel)]="model" type="text" class="form-control"/> apenas números
/// <input mascara="decimal" [(ngModel)]="model" type="text" class="form-control"/> #####,##
var MascaraDirective = MascaraDirective_1 = (function () {
    function MascaraDirective(renderer, element) {
        this.renderer = renderer;
        this.element = element;
        this._guide = true;
        this._placeholderChar = '_';
        this._pipe = undefined;
        this._keepCharPositions = false;
        this._onReject = undefined;
        this._onAccept = undefined;
        this.textMaskConfig = {
            mask: null,
            guide: true,
            placeholderChar: '_',
            pipe: undefined,
            keepCharPositions: false,
            onReject: undefined,
            onAccept: undefined
        };
        this._onTouched = function () { };
        this._onChange = function (_) { };
    }
    MascaraDirective.prototype.ngOnInit = function () {
        switch (this.mascara) {
            case 'telefone':
                this._mask = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
                this._guide = false;
                break;
            case 'numero':
                this._mask = createNumberMask_1.default({
                    prefix: '',
                    suffix: '',
                    includeThousandsSeparator: false,
                    allowDecimal: false
                });
                this._guide = false;
                this._keepCharPositions = true;
                break;
            case 'decimal':
                this._mask = createNumberMask_1.default({
                    prefix: '',
                    suffix: '',
                    thousandsSeparatorSymbol: '.',
                    decimalSymbol: ',',
                    allowDecimal: true,
                    requireDecimal: false,
                    decimalLimit: this.mascara_decimal ? parseInt(this.mascara_decimal) : 2,
                });
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
            this.inputElement = this.element.nativeElement;
        else
            this.inputElement = this.element.nativeElement.getElementsByTagName('INPUT')[0];
        this.textMaskInputElement = textMaskCore_1.createTextMaskInputElement(Object.assign({ inputElement: this.inputElement }, this.textMaskConfig));
    };
    MascaraDirective.prototype.writeValue = function (value) {
        if (this.textMaskInputElement !== undefined)
            this.textMaskInputElement.update(value);
    };
    MascaraDirective.prototype.registerOnChange = function (fn) { this._onChange = fn; };
    MascaraDirective.prototype.registerOnTouched = function (fn) { this._onTouched = fn; };
    MascaraDirective.prototype.onInput = function ($event) {
        this.textMaskInputElement.update($event.target.value);
        if (this.lastValue !== $event.target.value) {
            this.lastValue = $event.target.value;
            this._onChange($event.target.value);
        }
    };
    MascaraDirective.prototype.setDisabledState = function (isDisabled) {
        this.renderer.setElementProperty(this.element.nativeElement, 'disabled', isDisabled);
    };
    return MascaraDirective;
}());
__decorate([
    core_1.Input('mascara'),
    __metadata("design:type", String)
], MascaraDirective.prototype, "mascara", void 0);
__decorate([
    core_1.Input('mascara-decimal'),
    __metadata("design:type", Object)
], MascaraDirective.prototype, "mascara_decimal", void 0);
MascaraDirective = MascaraDirective_1 = __decorate([
    core_1.Directive({
        host: {
            '(input)': 'onInput($event)',
            '(blur)': '_onTouched()'
        },
        selector: '[mascara]',
        providers: [{
                provide: forms_1.NG_VALUE_ACCESSOR,
                useExisting: core_1.forwardRef(function () { return MascaraDirective_1; }),
                multi: true
            }]
    }),
    __metadata("design:paramtypes", [core_1.Renderer, core_1.ElementRef])
], MascaraDirective);
exports.MascaraDirective = MascaraDirective;
var MascaraDirective_1;
//# sourceMappingURL=mascara.directive.js.map