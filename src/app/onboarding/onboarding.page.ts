import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const rotate = trigger('rotate', [
  state('normal', style({ transform: 'rotate(0deg)' })),
  state('rotated', style({ transform: 'rotate(360deg)' })),
  transition('normal <=> rotated', animate('500ms ease-in-out'))
]);

const slideIn = trigger('slideIn', [
  transition(':enter', [
    style({ position: 'absolute', width: '100%', transform: 'translateX(100%)' }),
    animate('250ms ease-out', style({ transform: 'translateX(0)' }))
  ]),
  transition(':leave', [
    style({ position: 'absolute', width: '100%' }),
    animate('250ms ease-out', style({ transform: 'translateX(-100%)' }))
  ]),
  transition('* => avancar', [
    style({ position: 'absolute', width: '100%', transform: 'translateX(100%)' }),
    animate('250ms ease-out', style({ transform: 'translateX(0)' }))
  ]),
  transition('* => voltar', [
    style({ position: 'absolute', width: '100%', transform: 'translateX(-100%)' }),
    animate('250ms ease-out', style({ transform: 'translateX(0)' }))
  ])
]);

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  animations: [slideIn]
})
export class OnboardingPage implements OnInit {

  selectedSegments: string[] = [];
  isContinueButtonEnabled: boolean = false;

  toggleSelection(segment: string) {
    const index = this.selectedSegments.indexOf(segment);
    if (index > -1) {
      // Se o segmento já estiver selecionado, remova-o
      this.selectedSegments.splice(index, 1);
    } else if (this.selectedSegments.length < 6) {
      // Adicione aos segmentos selecionados se menos de 6 estiverem selecionados
      this.selectedSegments.push(segment);
    }
    
    // Verifique se exatamente 6 segmentos foram selecionados
    this.isContinueButtonEnabled = this.selectedSegments.length === 6;
  }

  isSelected(segment: string): boolean {
    return this.selectedSegments.includes(segment);
  }

  endereco = {
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    estado: '',
    cidade: ''
  };

  verificarInputs() {
    // Verifica se todos os campos obrigatórios estão preenchidos
    this.todosInputsPreenchidos();
  }

  todosInputsPreenchidos(): boolean {
    return !!(
      this.endereco.cep &&
      this.endereco.cep.length === 9 &&
      this.endereco.logradouro &&
      this.endereco.numero &&
      this.endereco.bairro &&
      this.endereco.estado &&
      this.endereco.cidade
    );
  }

  termsAccepted: boolean = false;

  toggleTermsAccepted() {
    this.termsAccepted = !this.termsAccepted;
    this.verificarContinuarHabilitado();
  }

  verificarContinuarHabilitado() {
    this.isContinueButtonEnabled = this.selectedSegments.length === 6 && this.termsAccepted;
  }


  dadosPessoais = {
    nomeCompleto: '',
    cpf: '',
    cnpj: '',
    dataNascimento: '',
    genero: '',
    orientacaoSexual: ''
  };

  verificarInputsPessoais() {
    // Verifica se todos os campos obrigatórios estão preenchidos
    this.todosInputsPessoaisPreenchidos();
  }

  todosInputsPessoaisPreenchidos(): boolean {
    return !!(
      this.dadosPessoais.nomeCompleto &&
      ((this.tipoPessoaSelecionada === 'pf' && this.dadosPessoais.cpf && this.dadosPessoais.cpf.length === 14) ||
       (this.tipoPessoaSelecionada === 'pj' && this.dadosPessoais.cnpj && this.dadosPessoais.cnpj.length === 18)) &&
      this.dadosPessoais.dataNascimento &&
      this.dadosPessoais.genero &&
      this.dadosPessoais.orientacaoSexual
    );
  }

  email: string = '';

  // Email validation method using regex
  validarEmail(email: string): boolean {
    const regex = /^[^\s]+@[^\s]+\.[^\s]+$/;
    return regex.test(email);
  }

  // Method to verify the email
  verificarEmail(): boolean {
    return this.validarEmail(this.email);
  }

  fase: number = 1;
  subfase: number = 1;

  tipoPessoaSelecionada: string | null = null;

  imagemPerfil: string | undefined;
  imagemPadrao = 'assets/imgs/insert-profile-pic-default.png';

  registerForm: FormGroup;
  enderecoForm: FormGroup;

  onTipoPessoaChange(tipo: string) {
    this.tipoPessoaSelecionada = tipo;
  }

  constructor(private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      cpf: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(14)]],
      cnpj: ['', [Validators.required, Validators.minLength(18), Validators.maxLength(18)]],
    });

    this.enderecoForm = this.formBuilder.group({
      cep: ['', Validators.required],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      estado: ['', Validators.required],
      cidade: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.enderecoForm.valid) {
      console.log(this.enderecoForm.value);
      // Lógica para processar o formulário de endereço
      this.avancarSubFase();
    }
  }

  ngOnInit() {
    // Aqui você pode carregar a imagem de perfil salva, se existir
    //this.definirFotoPerfil();
  }
  
  direcaoAnimacao: 'avancar' | 'voltar' = 'avancar';

  avancarFase() {
    this.direcaoAnimacao = 'avancar';
    this.fase++;
  }

  voltarFase() {
    if (this.fase > 1) {
      this.direcaoAnimacao = 'voltar';
      this.fase--;
    }
  }

  avancarSubFase() {
    this.subfase++;
  }

  voltarSubFase() {
    if (this.subfase > 1) {
      this.subfase--;
    }
    else {
      this.fase--;
    }
  }

  voltarAoInicio() {
    this.fase = 1;
  }
  senha: string = '';
  confirmacaoSenha: string = '';
  senhasIguais: boolean = false;
  senhaValida: boolean = false;

  verificarSenhas() {
    this.senhaValida = this.validarSenha(this.senha);
    this.senhasIguais = this.senha === this.confirmacaoSenha && this.senhaValida;
  }

  validarSenha(senha: string): boolean {
    const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])(?=.*\d).{8,}$/;
    return regexSenha.test(senha);
  }

  mostrarCriterios: boolean = false;

  toggleCriterios() {
    this.mostrarCriterios = !this.mostrarCriterios;
  }

  criteriosSenha = [
    { descricao: 'Pelo menos 8 caracteres', atendido: false },
    { descricao: 'Pelo menos uma letra maiúscula', atendido: false },
    { descricao: 'Pelo menos uma letra minúscula', atendido: false },
    { descricao: 'Pelo menos um número', atendido: false },
    { descricao: 'Pelo menos um caractere especial', atendido: false }
  ];

  verificarCriteriosSenha() {
    const regexMaiuscula = /[A-Z]/;
    const regexMinuscula = /[a-z]/;
    const regexNumero = /[0-9]/;
    const regexEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/;

    this.criteriosSenha[0].atendido = this.senha.length >= 8;
    this.criteriosSenha[1].atendido = regexMaiuscula.test(this.senha);
    this.criteriosSenha[2].atendido = regexMinuscula.test(this.senha);
    this.criteriosSenha[3].atendido = regexNumero.test(this.senha);
    this.criteriosSenha[4].atendido = regexEspecial.test(this.senha);

    this.senhaValida = this.criteriosSenha.every(criterio => criterio.atendido);
  }
  
  onCodeInput(event: any, index: number) {
    const input = event.target;
    const value = input.value;

    if (!/^\d*$/.test(value)) {
      input.value = '';
      return;
    }

    if (value.length === 1 && index < 5) {
      const nextInput = input.nextElementSibling;
      if (nextInput) {
        nextInput.focus();
      }
    } else if (value.length === 0 && index > 0) {
      const previousInput = input.previousElementSibling;
      if (previousInput) {
        previousInput.focus();
      }
    }

    this.checkAllInputsFilled();
  }

  allInputsFilled: boolean = false;

  checkAllInputsFilled() {
    const inputs = document.querySelectorAll('.single-digit-input');
    this.allInputsFilled = Array.from(inputs).every((input: Element) => {
      if (input instanceof HTMLInputElement) {
        return input.value.length === 1;
      }
      return false;
    });
  }
  senhaVisivel: boolean = false;
  confirmacaoSenhaVisivel: boolean = false;

  togglePasswordVisibility(event: Event, campo: 'senha' | 'confirmacaoSenha') {
    const button = event.target as HTMLElement;
    const input = button.closest('.password-input-container')?.querySelector('input') as HTMLInputElement;
    const img = button.querySelector('img') as HTMLImageElement;
    
    if (input) {
      if (campo === 'senha') {
        this.senhaVisivel = !this.senhaVisivel;
        input.type = this.senhaVisivel ? 'text' : 'password';
        img.src = this.senhaVisivel ? 'assets/imgs/open-eye-icon.png' : 'assets/imgs/closed-eye-icon.png';
      } else {
        this.confirmacaoSenhaVisivel = !this.confirmacaoSenhaVisivel;
        input.type = this.confirmacaoSenhaVisivel ? 'text' : 'password';
        img.src = this.confirmacaoSenhaVisivel ? 'assets/imgs/open-eye-icon.png' : 'assets/imgs/closed-eye-icon.png';
      }
      img.alt = input.type === 'password' ? 'Mostrar senha' : 'Ocultar senha';
    }
  }

  async definirFotoPerfil() {
    try {
      const imagem = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });

      this.imagemPerfil = imagem.dataUrl;
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
    }
  }

  public cpfMask: MaskitoOptions = {
    mask: [
      /\d/, /\d/, /\d/, '.',
      /\d/, /\d/, /\d/, '.',
      /\d/, /\d/, /\d/, '-',
      /\d/, /\d/
    ],
  };

  public cnpjMask: MaskitoOptions = {
    mask: [
      /\d/, /\d/, '.',
      /\d/, /\d/, /\d/, '.',
      /\d/, /\d/, /\d/, '/',
      /\d/, /\d/, /\d/, /\d/, '-',
      /\d/, /\d/
    ],
  };

  readonly maskPredicate: MaskitoElementPredicate = async (el) =>
   (el as HTMLIonInputElement).getInputElement();

  mascaraCPF(event: any) {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) {
      value = value.slice(0, 11);
    }
    if (value.length > 9) {
      value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      value = value.replace(/^(\d{3})(\d{3})(\d{3}).*/, '$1.$2.$3');
    } else if (value.length > 3) {
      value = value.replace(/^(\d{3})(\d{3}).*/, '$1.$2');
    }
    input.value = value;
    this.dadosPessoais.cpf = value;
  }

  mascaraCNPJ(event: any) {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 14) {
      value = value.slice(0, 14);
    }
    if (value.length > 12) {
      value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, '$1.$2.$3/$4-$5');
    } else if (value.length > 8) {
      value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4}).*/, '$1.$2.$3/$4');
    } else if (value.length > 5) {
      value = value.replace(/^(\d{2})(\d{3})(\d{3}).*/, '$1.$2.$3');
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{3}).*/, '$1.$2');
    }
    input.value = value;
    this.dadosPessoais.cnpj = value;
  }

  mascaraCEP(event: any) {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 8) {
      value = value.slice(0, 8);
    }
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d{3}).*/, '$1-$2');
    }
    input.value = value;
    this.endereco.cep = value;
  }
}