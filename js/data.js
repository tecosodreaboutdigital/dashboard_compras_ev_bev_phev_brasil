// Dados portados verbatim de design-reference/Dashboard EV Recife.dc.html
// Fonte de verdade: HANDOFF.md + o próprio protótipo. Não são dados fictícios.
'use strict';

const VEICULOS = [
    { id:'dolphin_mini', nome:'BYD Dolphin Mini GS', marca:'BYD', tipo:'BEV', origem:'Nacional', preco:119990, bateria:38.88, autonomia:280, consumo:13.90, potencia:75, torque:180, aceleracao:14.9, tracao:'Dianteira', comprimento:3780, entreEixos:2500, portaMalas:230, airbags:6, latinNcap:'Não testado', adas:'Básico, sem ACC', acc:false, camera:'Ré', suspTras:'Torção', recargaDC:'—', v2l:true, tetoPan:false, estepe:false, descontoEnergia:0.15, revisoes:3320, pneus:2800, outros:1800, residual:{pess:0.36, base:0.45, otim:0.52}, notas:{seg:4.5, rede:9.5, conf:4.0}, link:'https://www.byd.com/br/car/dolphin-mini' },
    { id:'ex2_pro', nome:'Geely EX2 Pro', marca:'Geely', tipo:'BEV', origem:'Importado', preco:123800, bateria:39.4, autonomia:289, consumo:13.63, potencia:116, torque:150, aceleracao:10.5, tracao:'Traseira', comprimento:4135, entreEixos:2650, portaMalas:375, frunk:70, airbags:6, latinNcap:'Não testado', adas:'Reduzido', acc:false, camera:'540°', suspTras:'Torção', recargaDC:'70 kW', v2l:true, tetoPan:false, estepe:false, descontoEnergia:0, revisoes:2305, pneus:3000, outros:1800, residual:{pess:0.32, base:0.41, otim:0.48}, notas:{seg:5.5, rede:7.5, conf:5.0}, link:'https://static.autoforce.com/plugins/files/clientes/geely-brasil/produtos/ws/Ficha_Tecnica_GEELY_EX2.pdf' },
    { id:'mg4_c43', nome:'MG4 Urban Comfort 43', marca:'MG', tipo:'BEV', origem:'Importado', preco:129990, bateria:43.0, autonomia:299, consumo:14.38, potencia:150, torque:250, aceleracao:9.6, tracao:'Dianteira', comprimento:4280, entreEixos:2750, portaMalas:477, airbags:6, latinNcap:'Não testado', adas:'Completo', acc:true, camera:'360°', suspTras:'Torção', recargaDC:'82 kW · 10–80% em 28–30 min', v2l:null, tetoPan:false, estepe:false, descontoEnergia:0, revisoes:3800, pneus:3600, outros:1800, residual:{pess:0.30, base:0.38, otim:0.46}, notas:{seg:7.0, rede:6.5, conf:5.5}, link:'https://mgmotoroficial.com.br/model/mg4urban/' },
    { id:'ex2_max', nome:'Geely EX2 Max', marca:'Geely', tipo:'BEV', origem:'Importado', preco:136800, bateria:39.4, autonomia:289, consumo:13.63, potencia:116, torque:150, aceleracao:10.2, tracao:'Traseira', comprimento:4135, entreEixos:2650, portaMalas:375, frunk:70, airbags:6, latinNcap:'Não testado', adas:'Completo', acc:true, camera:'540°', suspTras:'Torção', recargaDC:'70 kW', v2l:true, tetoPan:false, estepe:false, descontoEnergia:0, revisoes:2305, pneus:3000, outros:1800, residual:{pess:0.32, base:0.41, otim:0.48}, notas:{seg:7.0, rede:7.5, conf:7.0}, link:'https://static.autoforce.com/plugins/files/clientes/geely-brasil/produtos/ws/Ficha_Tecnica_GEELY_EX2.pdf' },
    { id:'mg4_l43', nome:'MG4 Urban Luxury 43', marca:'MG', tipo:'BEV', origem:'Importado', preco:139990, bateria:43.0, autonomia:299, consumo:14.38, potencia:150, torque:250, aceleracao:9.6, tracao:'Dianteira', comprimento:4280, entreEixos:2750, portaMalas:477, airbags:6, latinNcap:'Não testado', adas:'Completo', acc:true, camera:'360°', suspTras:'Torção', recargaDC:'82 kW · 10–80% em 28–30 min', v2l:null, tetoPan:false, estepe:false, descontoEnergia:0, revisoes:3800, pneus:3600, outros:1800, residual:{pess:0.30, base:0.38, otim:0.46}, notas:{seg:7.5, rede:6.5, conf:7.0}, link:'https://mgmotoroficial.com.br/model/mg4urban/' },
    { id:'dolphin_gs', nome:'BYD Dolphin GS', marca:'BYD', tipo:'BEV', origem:'Importado', preco:149990, bateria:44.9, autonomia:291, consumo:15.43, potencia:95, torque:180, aceleracao:10.9, tracao:'Dianteira', comprimento:4125, entreEixos:2700, portaMalas:250, airbags:6, latinNcap:'Não testado (o Dolphin Plus obteve 5 estrelas)', adas:'Parcial', acc:null, camera:'360°', suspTras:'Torção', recargaDC:'—', v2l:true, tetoPan:false, estepe:false, descontoEnergia:0.15, revisoes:3320, pneus:3200, outros:1800, residual:{pess:0.34, base:0.43, otim:0.50}, notas:{seg:6.5, rede:9.5, conf:6.5}, link:'https://www.byd.com/br/car/dolphin' },
    { id:'mg4_l54', nome:'MG4 Urban Luxury 54', marca:'MG', tipo:'BEV', origem:'Importado', preco:149990, bateria:54.0, autonomia:358, consumo:15.08, potencia:160, torque:250, aceleracao:9.5, tracao:'Dianteira', comprimento:4280, entreEixos:2750, portaMalas:477, airbags:6, latinNcap:'Não testado', adas:'Completo — ACC, LKA, BSD, FCA, DMS, RCTA', acc:true, camera:'360°', suspTras:'Torção', recargaDC:'87 kW · 10–80% em 28–30 min', v2l:null, tetoPan:false, estepe:false, descontoEnergia:0, revisoes:3800, pneus:3600, outros:1800, residual:{pess:0.30, base:0.38, otim:0.46}, notas:{seg:7.5, rede:6.5, conf:8.0}, link:'https://mgmotoroficial.com.br/model/mg4urban/' },
    { id:'ora5', nome:'GWM ORA 5', marca:'GWM', tipo:'BEV', origem:'Importado', preco:159900, bateria:58.3, autonomia:349, consumo:16.70, potencia:204, torque:260, aceleracao:7.7, tracao:'Dianteira', comprimento:4471, entreEixos:2720, portaMalas:362, airbags:6, latinNcap:'Não testado', adas:'Nível 2+', acc:true, camera:'540°', suspTras:'Multilink', recargaDC:'120 kW · 30–80% em ~20 min', v2l:true, tetoPan:true, estepe:false, descontoEnergia:0, revisoes:4200, pneus:4500, outros:1800, residual:{pess:0.30, base:0.38, otim:0.46}, notas:{seg:7.5, rede:8.0, conf:9.5}, link:'https://www.gwmmotors.com.br/pt/modelos/ora5' },
    { id:'dolphin_se', nome:'BYD Dolphin SE', marca:'BYD', tipo:'BEV', origem:'Importado', preco:159990, bateria:45.12, autonomia:272, consumo:16.59, potencia:177, torque:290, aceleracao:8.0, tracao:'Dianteira', comprimento:4125, entreEixos:2700, portaMalas:250, airbags:6, latinNcap:'Não testado', adas:'Completo', acc:true, camera:'360°', suspTras:'Multilink', recargaDC:'80 kW · 30–80% em ~20 min', v2l:true, tetoPan:null, estepe:false, descontoEnergia:0.15, revisoes:3320, pneus:3200, outros:1800, residual:{pess:0.33, base:0.42, otim:0.49}, notas:{seg:7.0, rede:9.5, conf:8.5}, link:'https://www.byd.com/br/car/dolphin-se' },
    { id:'ora03', nome:'GWM ORA 03 BEV58', marca:'GWM', tipo:'BEV', origem:'Importado', preco:169000, bateria:58.0, autonomia:315, consumo:18.41, potencia:171, torque:250, aceleracao:8.2, tracao:'Dianteira', comprimento:4235, entreEixos:2650, portaMalas:228, airbags:7, latinNcap:'5 estrelas (linha ORA 03)', adas:'Nível 2+', acc:true, camera:'360°', suspTras:'Torção', recargaDC:'—', v2l:true, tetoPan:true, estepe:false, descontoEnergia:0, revisoes:4200, pneus:3800, outros:1800, residual:{pess:0.27, base:0.34, otim:0.42}, notas:{seg:9.5, rede:8.0, conf:9.0}, obsComercial:'R$ 20.000 de bônus na nota OU taxa 0% — condições excludentes', link:'https://www.gwmmotors.com.br/pt/modelos/ora-03-bev58' },
    { id:'b10', nome:'Leapmotor B10', marca:'Leapmotor', tipo:'BEV', origem:'Importado', preco:182990, bateria:56.2, autonomia:288, consumo:19.51, potencia:218, torque:240, aceleracao:8.0, tracao:'Traseira', comprimento:4515, entreEixos:2735, portaMalas:430, airbags:6, latinNcap:'Não testado', adas:'Avançado', acc:true, camera:'360°', suspTras:'Multilink', recargaDC:'140 kW · 30–80% em 16 min', v2l:null, tetoPan:true, estepe:false, descontoEnergia:0, revisoes:4500, pneus:4500, outros:1800, residual:{pess:0.26, base:0.33, otim:0.41}, notas:{seg:7.0, rede:5.5, conf:8.5}, obsComercial:'FIPE 2026 em R$ 158.985, abaixo do preço de tabela', link:'https://www.mobiauto.com.br/tabela-fipe/carros/leapmotor/b10' },
    { id:'atto2', nome:'BYD Atto 2 DM-i Flex GL', marca:'BYD', tipo:'PHEV', origem:'Nacional', preco:149990, bateria:7.85, autonomia:1000, autonomiaEletrica:45, consumo:0, kmPorLitro:14.0, kmPorLitroEstimado:true, potencia:177, torque:300, aceleracao:8.5, tracao:'Dianteira', comprimento:4330, entreEixos:2620, portaMalas:455, airbags:6, latinNcap:'Não testado', adas:'ACC e AEB de série', acc:true, camera:'360°', suspTras:'Torção', recargaDC:'—', v2l:null, tetoPan:false, estepe:false, descontoEnergia:0, revisoes:4500, pneus:3000, outros:1800, residual:{pess:0.34, base:0.42, otim:0.49}, notas:{seg:7.0, rede:3.0, conf:6.5}, obsComercial:'PHEV, 45 km só no elétrico — sem recarga em casa, roda quase só a etanol/gasolina; elegível ao Programa Move Brasil por sair abaixo de R$150 mil', link:'https://www.byd.com/br' },
    { id:'jaecoo7', nome:'Jaecoo 7 Elite', marca:'Jaecoo', tipo:'PHEV', origem:'Importado', preco:179990, bateria:18.3, autonomia:1200, autonomiaEletrica:79, consumo:0, kmPorLitro:13.0, kmPorLitroEstimado:true, potencia:279, torque:450, aceleracao:7.0, tracao:'Dianteira', comprimento:4500, entreEixos:2672, portaMalas:450, portaMalasEstimado:true, airbags:6, airbagsEstimado:true, latinNcap:'Não testado', adas:'AEB, alerta de colisão, LKA e ACC', acc:true, camera:'Ré com linhas dinâmicas', suspTras:'Não informado', recargaDC:'40 kW · 20–80% em ~20 min', v2l:null, tetoPan:false, estepe:false, descontoEnergia:0, revisoes:5500, pneus:3800, outros:1800, residual:{pess:0.28, base:0.36, otim:0.43}, notas:{seg:6.5, rede:3.0, conf:6.0}, obsComercial:'PHEV, 79 km só no elétrico — dados de peso, torque isolado e financiamento próprios da versão Elite ainda não confirmados pela marca', link:'https://www.jaecoo.com.br' },
    { id:'songpro', nome:'BYD Song Pro Super-Híbrido Flex GL', marca:'BYD', tipo:'PHEV', origem:'Nacional', preco:176990, bateria:13.1, autonomia:1075, autonomiaEletrica:57, consumo:0, kmPorLitro:15.0, kmPorLitroEstimado:true, potencia:218, torque:300, aceleracao:8.8, tracao:'Dianteira', comprimento:4740, entreEixos:2710, portaMalas:530, airbags:6, latinNcap:'Não testado', adas:'ACC, AEB, LKA e reconhecimento de placas', acc:true, camera:'360°', suspTras:'Multilink', recargaDC:'—', v2l:true, tetoPan:false, estepe:false, descontoEnergia:0, revisoes:5000, pneus:3600, outros:1800, residual:{pess:0.34, base:0.42, otim:0.49}, notas:{seg:7.0, rede:3.0, conf:6.5}, obsComercial:'PHEV, 57 km só no elétrico — sem recarga em casa, roda quase só a etanol/gasolina', link:'https://www.byd.com/br' },
    { id:'omoda5', nome:'Omoda 5 HEV Luxury', marca:'Omoda', tipo:'HEV', origem:'Importado', preco:159990, bateria:1.5, autonomia:900, autonomiaEletrica:0, consumo:0, kmPorLitro:14.15, potencia:224, torque:295, aceleracao:7.9, tracao:'Dianteira', comprimento:4447, entreEixos:2610, portaMalas:372, airbags:7, latinNcap:'Não testado', adas:'Básico, sem ACC confirmado', acc:false, camera:'360°', suspTras:'Multilink', recargaDC:'—', v2l:null, tetoPan:false, estepe:false, descontoEnergia:0, revisoes:4800, pneus:3400, outros:1800, residual:{pess:0.28, base:0.36, otim:0.43}, notas:{seg:6.0, rede:0, conf:7.0}, obsComercial:'HEV sem plugue nenhum — carrega só por frenagem regenerativa e pelo motor a combustão', link:'https://www.omoda-jaecoo.com.br' },
    { id:'tiggo7', nome:'Chery Tiggo 7 Pro Hybrid Max Drive', marca:'Chery', tipo:'HEV', origem:'Nacional', preco:181990, bateria:1.0, autonomia:570, autonomiaEletrica:0, consumo:0, kmPorLitro:11.15, potencia:160, torque:250, aceleracao:9.7, tracao:'Dianteira', comprimento:4500, entreEixos:2670, portaMalas:475, portaMalasEstimado:true, airbags:6, latinNcap:'Não testado', adas:'AEB, LKA, ACC e monitoramento de ponto cego', acc:true, camera:'360°', suspTras:'Multilink', recargaDC:'—', v2l:null, tetoPan:true, estepe:false, descontoEnergia:0, revisoes:5200, pneus:3800, outros:1800, residual:{pess:0.32, base:0.40, otim:0.47}, notas:{seg:7.5, rede:0, conf:7.5}, obsComercial:'Híbrido leve 48V (BSG) sem plugue nenhum — porta-malas divergente entre fontes (330 L a 475 L)', link:'https://www.caoachery.com.br' }
  ];

const FOTOS = {
    dolphin_mini:[
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiV82YtMpVqPkzRQDO6X8ZhFfIsjp_NaYEdfkqCuSrraq-B8H5xriLTlW0cEECoAfxXaHimaT6UO6VOUqoFzQ75X_-4Ty2Vj_mxiuMK4m_o8cy4a2qLMMvgVMRxkOXahiNJz3oTkVkabueGVlcZXdqxU8eaY2epRJ7HbUJr7w_l875UTLFhS_u_8VmYCXkH/s2560/BYD-Dolphin-MINI%20(58).jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgVGA1zcueMwRgYBVX8TLUcSAgcLEqyFIijeOoMXeHTyyfGXuYGYutQVuY4Vhpy4d_ZFTpwE7b2RsW1GbpH_vx5Im27H0Gv8r5VEBiM-4Lw2pmhAC1-bRUKqBHhNNkCxrs92PNs67PzI_Gks-ZAVoFBgmAKLtWeW-2l2Rgxi9pGifgxZx7zZDafCdhq7ptu/s2560/BYD-Dolphin-MINI%20(109).jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi1lQs8mRq2gcDQoH5YeUngWq-xIXnlGaMZ4XwD1PT7IJeYGR9Wrv4ue7u3ODJH7-kl1LxMXP8A0aMWv_c0nEKH18oth7iAVrWXvu4SuetZxv7tl47h7uS8WJDxDmhgTY4B5njLJGfEQUdOpjRUv0Q_DfG27g8aneGVstC1n4MVtZtAbKI86wFQEx9mc20o/s2560/BYD-Dolphin-MINI%20(76).jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiCL_MXd5VbUMShQKDi4oQi4vPEo5Oztxc4t_-XXoUulZJklXcK5N3Q_6Z6JhvVgjgLGrQ3iiTpHfd9__YiFxcLoVhsOEErknJWQjF5F5uraL-qnf589DG9iyOvp81QgGjmpoHO45Wc-BrmQm9FG2acd7CIYxBS5WF7R_vgTnapU2i93R9cIJF_uwMoBifM/s2560/BYD-Dolphin-MINI%20(78).jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg2jxv_1SNqSy-1eaK06fy4J0_tEu8k5vWJkNcVMXyo1B5UCsWGYI5AjihI63ufPHQZ3Hx3jFd-ICwTO41Vra58nxd5TzUIY83ZrCi1XJb9BN7tIBO2i6g7kvxDMUANKj2iYIy3hSLw4gpmkjkAxlkZDwlG9mTmUwQcUAyWxRt7LLptC8LIR2-aoxwaEQIh/s2560/BYD-Dolphin-MINI%20(105).jpg'
    ],
    ex2_pro:[
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiVYLVJWx7XCl8xPZCHvy4pAQaLIHTpBH_Dr-dTF6lXmhZj7Jp2pyLzdcsrlzy0G-GCzVtajMQulyyH6fc9-iqcyu2GbhyuyuG_f8nrpyr9AKnNZVMAiuTkldeM08N_hmoFXxptfSPAKxALsPYzH8m1304GFqMDEYa34rzWziffDRqTL0JEqXDhhSiQPpYm/s2366/Geely-EX2-Max-2026%20(26).jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg9faE32pmcpec4xNCjAUJeNTZHXNt0iyVLUKRVfl2l0OiCSHTm89ihbm4_oceBRWdT_XvcXA_-8G0nUKFesoIVjLKIF5vdxvqBqznfgY7fNdxTgxXhIdGeycfMBh_uLFspJUS20-i5Rc2iDOH0GWvxMxeh8IYvbaYUpZ-WdfW50GpNxlTNkYUR1sp_ubxG/s2375/Geely-EX2-Max%20(40).jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh4A28F_op6_CjcK3GueKMhzS9vlP6D1U4Tzqjn0TNHuTetfzun2Yq1baP2K_XHth7ksDqXste0uDJ18FFPstg6RYz7oRHAjQnSwFzFT7fJqeiHqJSlHPlBlIpnKwWEAfMXGBynDQWVr9EwdbLThQ-ZSk7l4Dcg-oJ_oSpbtE3dvZxuA1u5AIMKouBEtf5b/s2560/Geely-EX2-Max-2026%20(21).jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhZmwmqaEhlYU4yQ2iyHT0M68E4WUPCwXOpCBazGLuwLmZBrJZiJXK8QJMgUZGTC2T0y1-v-FlrUrym-tbQ4wCagSMkqiGMQjzeKMpavmsDGPMgx-m2-oQhK0g6hkoqI5NhVZ0Gnm_en__g6bljXAKe40MaPD-ij-eD811VPLK4XGcUPbFlJ8kY95ANO5Xs/s2560/Geely-EX2-Max%20(52).jpg',
      'https://static.autodromo.com.br/uploads/8aab83a5-c041-4fa6-9440-b6c458ee1f1b_laGEE002725_ImagensSite_desktop_1920x756px_Design_01.webp'
    ],
    mg4_c43:[
      'https://mgmotoroficial.com.br/imagens/new-mg4-urban/banner.jpg',
      'https://mgmotoroficial.com.br/imagens/new-mg4-urban/img11.jpg',
      'https://mgmotoroficial.com.br/imagens/new-mg4-urban/img02.jpg',
      'https://mgmotoroficial.com.br/imagens/new-mg4-urban/img03.jpg',
      'https://mgmotoroficial.com.br/imagens/new-mg4-urban/img04.jpg'
    ],
    ex2_max:[
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg9faE32pmcpec4xNCjAUJeNTZHXNt0iyVLUKRVfl2l0OiCSHTm89ihbm4_oceBRWdT_XvcXA_-8G0nUKFesoIVjLKIF5vdxvqBqznfgY7fNdxTgxXhIdGeycfMBh_uLFspJUS20-i5Rc2iDOH0GWvxMxeh8IYvbaYUpZ-WdfW50GpNxlTNkYUR1sp_ubxG/s2375/Geely-EX2-Max%20(40).jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh4A28F_op6_CjcK3GueKMhzS9vlP6D1U4Tzqjn0TNHuTetfzun2Yq1baP2K_XHth7ksDqXste0uDJ18FFPstg6RYz7oRHAjQnSwFzFT7fJqeiHqJSlHPlBlIpnKwWEAfMXGBynDQWVr9EwdbLThQ-ZSk7l4Dcg-oJ_oSpbtE3dvZxuA1u5AIMKouBEtf5b/s2560/Geely-EX2-Max-2026%20(21).jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhZmwmqaEhlYU4yQ2iyHT0M68E4WUPCwXOpCBazGLuwLmZBrJZiJXK8QJMgUZGTC2T0y1-v-FlrUrym-tbQ4wCagSMkqiGMQjzeKMpavmsDGPMgx-m2-oQhK0g6hkoqI5NhVZ0Gnm_en__g6bljXAKe40MaPD-ij-eD811VPLK4XGcUPbFlJ8kY95ANO5Xs/s2560/Geely-EX2-Max%20(52).jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgSkh7ni5HvH26GlsxE4HdCO2xFoSGGIyzvDzLDBXRma03Wo4VK5pcXCcbYSqKzSTYuuqTVxeIdqv4Y4TApL9_SjAMK4U8oEcBmFfgUBp7-YCIqdgM5MkPi6CM3yq0yL3QXV4yioTh-IEnExXxarCJmRWsarn5ZCXS9607_6JOfOY_xqJun_Oyg5vZVabpO/s2560/Geely-EX2-Max%20(43).jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjg2xISgyeTToRLxpcR1OZfHzatXd_RNf2uCT9GGhAdfLZo84ag_rrq9VF6Yj01ptWY_6I8P9rGqSa-GdJVaqOE-S0XwYse2T7_BdKbITmENAjSejIdD6CNz5t34s6yFBqpQCPMBStepMz2HG0EAGWCOlay8q5LrdHtjG0nKRCA9RCIbT8ZgmlBcJbJMWgh/s2560/Geely-EX2-Max%20(34).jpg'
    ],
    mg4_l43:[
      'https://mgmotoroficial.com.br/imagens/new-mg4-urban/img13.png',
      'https://mgmotoroficial.com.br/imagens/new-mg4-urban/banner.jpg',
      'https://mgmotoroficial.com.br/imagens/new-mg4-urban/img05.jpg',
      'https://mgmotoroficial.com.br/imagens/new-mg4-urban/img06.jpg',
      'https://mgmotoroficial.com.br/imagens/new-mg4-urban/img09.jpg'
    ],
    dolphin_gs:[
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgl1NmeAZ6HSmZUWXU4lcHSscRhp6bOCNPK76LXbRIGQwR1LkJL757sgI4w-WezNJrga0bYvsRiXEwlgXIfMz5KR5dGhEtRwkt1QTbaZYOPQBn-1ZKUc46LYdUGY24ZmH9vTe6IVr1OoQA0mZa4c6SWNa6pq1PVwBBTNME82JmhW08UXh1p8Y1nV8_BPSi4/s2560/BYD-Dolphin-2026%20(40).jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjoi7b8yYqErPZRUd09nI-ZTJRfhfotLrvuCx0oBoJk7RvWYbrawkVwwvxx2R7IyiWFGNoFTsvlC43bGObDQmf3xmIQ3h9iBcx3tmW02YT-mXZ39h9N-7xWle3MGLMa-oY0c0IKfKrd2BwzV7PkWeFlpyqegpb3B3s5aBn0vq292__cwVGOFd7MtSt-vlDH/s2560/BYD-Dolphin-2026%20(1).jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgcJP0qyG0mVB7wNvPzqQuHMrxRnMaSwvs9lkGz5Sx2D41eKZ4biLMqYcRiYhb2D14pmQYomlHz5dJFM4SzE29SB15gHpITihY8pzxa3eiPlFemf8yGyqRI6uEnxg4lwSZtgyCqeC-12aB2w0ysfnjAJOI_Y0GmS-cSBPFS1QbDsh9lVmVP19lvsW4z2W4R/s2560/BYD-Dolphin-2026%20(31).jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhFJNa1HOrhajkFSYs4F0iPuekYpNmPWkx_g9IqTX3fJmEimVxARzy3ul4XGQ-rGaPXYw_JmzR4joQFxJvfglCOkS1tZlCy9jLoaLqKdsc6Kf_gLvNATGTQvzFUESqa34Gf9OGqX4cMi4CikAQxsXVOaetdbSSpcHL1IvNVu4IkXSvw0NODLsWCPMxSAc3z/s2560/RDUR7969.jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjHCm4YGduedkX_rTrIjg8MJYsHpSQI5lUIfMebAUEo2pUn-FUoOW08OE6ZvrKBTrF_X-4kEPc00FS8XhLRSx136Cz6qP6qSlcXM4KqkKzUFbaDTukMB9J1jH7FU1i0NbX_5kJYzXedU5VIfzs2oslgA1MIa-65GObfidqcfpUIhwfjzi_JsOskCZXgq9cU/s2560/BYD-Dolphin-2026%20(20).jpg'
    ],
    mg4_l54:[
      'https://mgmotoroficial.com.br/imagens/new-mg4-urban/img12.jpg',
      'https://mgmotoroficial.com.br/imagens/new-mg4-urban/banner.jpg',
      'https://mgmotoroficial.com.br/imagens/new-mg4-urban/interior-04.jpg',
      'https://mgmotoroficial.com.br/imagens/new-mg4-urban/img-contact-form.jpg',
      'https://mgmotoroficial.com.br/imagens/new-mg4-urban/img09.jpg'
    ],
    ora5:[
      'https://www.gwmmotors.com.br/content/dam/gwm/pages/br/pt/media-center/modelos/ora-5/principal-ora5%20(1).jpg',
      'https://www.gwmmotors.com.br/content/dam/gwm/pages/br/pt/media-center/modelos/ora-5/1.jpg',
      'https://www.gwmmotors.com.br/content/dam/gwm/pages/br/pt/media-center/modelos/ora-5/2.jpg',
      'https://www.gwmmotors.com.br/content/dam/gwm/pages/br/pt/media-center/modelos/ora-5/3.jpg',
      'https://www.gwmmotors.com.br/content/dam/gwm/pages/br/pt/media-center/modelos/ora-5/4.jpg'
    ],
    dolphin_se:[
      'https://canalve.com.br/wp-content/uploads/2026/04/BYD_YuanPlus_DolphinSE0001.jpg',
      'https://canalve.com.br/wp-content/uploads/2026/04/2.jpg',
      'https://canalve.com.br/wp-content/uploads/2026/04/3.jpg',
      'https://www.byd.com/material/byd-site/br/home/home-2025/2025-seo/thumbs/thumb-byd-dolphin.jpg',
      ''
    ],
    ora03:[
      'https://www.gwmmotors.com.br/content/dam/gwm/pages/br/pt/media-center/modelos/ora-03-bev58/principal-ora-bev58.jpg',
      'https://www.gwmmotors.com.br/content/dam/gwm/pages/br/pt/media-center/modelos/ora-03-bev58/1.jpg',
      'https://www.gwmmotors.com.br/content/dam/gwm/pages/br/pt/media-center/news/2025/novas-cores-bev58/principal-ora.jpg',
      'https://www.gwmmotors.com.br/content/dam/gwm/pages/br/pt/media-center/modelos/ora-03-bev58/novas-cores/galeria-ora.jpg',
      'https://www.gwmmotors.com.br/content/dam/gwm/pages/br/pt/media-center/modelos/ora-03-bev58/novas-cores/10.jpg'
    ],
    b10:[
      'https://stellantis3.dam-broadcast.com/medias/domain12808/media110214/3064401-ng77xss8kc-whr.jpg',
      'https://stellantis3.dam-broadcast.com/medias/domain12808/media110214/3064404-m816lrj6n0-whr.jpg',
      'https://stellantis3.dam-broadcast.com/medias/domain12808/media110214/3064407-fdj2n7mijp-whr.jpg',
      'https://stellantis3.dam-broadcast.com/medias/domain12808/media110214/3064410-gua2ugg57h-whr.jpg',
      'https://stellantis3.dam-broadcast.com/medias/domain12808/media110214/3064413-emvf18ba3c-whr.jpg'
    ],
    atto2:[
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiL1JhOdq6BY6IgSWKHJpM6bO5UlxFYi1bfswuVooISHwtorIyjgFOMCBXuOy8bH2VSeXH-PCmqSKgHamYvUaH1mHM6Vk0-pKlcIeuBaD4n_77nWWPQA04o6iAtAUef6ipF4c9cQPEBp_DxIslngYjERxzPCqrkodTkmf5vUm8u2AWE1_138LxeXn0F0M9R/s2560/BYD-Atto-2-Hibrido-Flex-Brasil%20(3).jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhnT3VEauCrPR6aFd_IVDx18RJsOqnjhxHA4_0T_6R5kyQmDHsSVkiAtqZwYhnpxraQeuS_vSyU47I6sz3bJxZH4TYK9EmBUJr7gN2GSW6zODP9dkXKs_caiK5Z3ECCEhRpVVYyecmAupqw_pDcmfngAB9GNO2rJwuDoGykTg8NUkd4HXRBC8bFdDvrLrp-/s2560/BYD-Atto-2-Hibrido-Flex-Brasil%20(28).jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhfdGZ92eQ9aaoHaLmlvS1Aaduy7ln77YkYV_a5FCgPi2apd2ApJEixkYoPMN7eJ2_ZzrTj_O5A7aXOf0hyNsQuJde6GJCB7XRpDlpJolrrN83_4YQtQ_lna-gHXGSdaM3T9wRefayXNmdPYVLSCoGv3LrEIZ3BBCKs6uSOZRXT4NnQQAT4j1zKdFKhVwoc/s2560/BYD-Atto-2-hibrido-detalhes%20(4).jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEglcpNOWWzzivxVor_IazV8OVStt2qkhzxLFqvQtRDW6cYcvvSKbmCZWKv_rNH-UAOcFvs1tewmhA9O59yH0SYTV53Qs81f_8_0ITYb7BWAiGb1PI6sjX6Yolkfz3Y3Pa5Ev396xODnArYtHnWFpumgIJ_GAe_JHucC22wtujemfKQiNGwTp_KTzh4DYeiQ/s2560/BYD-Atto-2-Hibrido-Flex-Brasil%20(52).jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiY-YqTQkE97ojhgHOk9i8S6oLAklbilSpoZZYF86BeyIQo9NTCP4ucmfKJqkLkIJargLe2JFk0kWWekjxKcq2kUGK7eMtOKNMShquwDej8Rs5ehipt_w3lpZuBJt-3LKUMvNvWX83zUn1OOnrH11kZnLPggqXes3EKQd7kY4M5G0_cXyqkF0Vn-KbfRWC9/s2560/BYD-Atto-2-hibrido-detalhes%20(16).jpg'
    ],
    jaecoo7:[
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh53V8JZD-sfdbs3WCVKxrL-XrVUs8FVKdr3btcQs3dFf68HGwnrF43ejl81x93pfvrDmHRGHgEyiSIM-WnHQu_I-UEW46AMk0eBiD9Gyxr8EUtRXBETiXSigSodCGsax4wqPnLw4BFi7J-VrerfcLZc_6NfzvJBCahSFV8Yd6fUksxbpsCgqk2kHr_QbAm/s4353/J7_Elite_009.jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiSKs1K4IwA_BNz3hGAVRSlScepdtNY6sIHLi2epR4nS6cZA2NujeG4fujpJPgKEfHiCFsRoevZyCYg-ikXJgwqbpPihBHgSDCmwTKOf_0eza6SaZKM87f-r6z4BTVVT8uKT_nwtchI_rEt1BDO6plAmB_d0EyvGrSa6x_X9EU80H60HD4xerU53lZjH_SR/s3822/J7_Elite_015.jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgmdFuOb8SwoHgfhGNT_N_jZROa3ckUHDKZsee7BUIT5sJVp-zE6R4IoJs_oq8yj6EyiZAIpxEU0QutiaHLoWWWp8Hi0Ou4UJVjX7ENvWc3mK8O6KNHXaJFkAQyy6l5RYHJjbds2x-S3JCO6Vpn-JHS3Z9hT7J97rZsTv3kk80oL0ji-4ymNCJNpNphfngk/s7008/J7_Elite_028.jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhZo2nZ-ickvFi5JaMGSrPDoekkGf_-8wpalHxNnsSGANNSxEC1X2jXMgczkF1B7VrYCNNWWg-y-a03aV1QJuAEY2Qmmzb3DQLujNXq1GJptSWqt5oedBDtj2rWZeTdyLPKgqp3p9U6J0-OHWt3MaOZL5rnF1mcm3ewop4Fyk2gBrHirJ-MsIcm6L26P6rv/s6595/J7_Elite_029.jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiVUSq170iWxjYUmokIhyPTHjc9Zy76k9khk2hscpt7ralrhbNgGBAUx_i_VYV7UIl1j0Abcy2_CfmmlEV_JjUaA3bNRTwL64L3UxyLy9hO7Dd3dCaLLNjFPP4dOASrsK04t1gTEQUzkM_Cdnj31hVDSO1qgY430S65pxixAlkJXdYMMzvnVDiY0CLQp5RZ/s7008/J7_Elite_026.jpg'
    ],
    songpro:[
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjg3lbrQvfrRlYTwtkc9v2v_VnhgYL6bvYS3VMS804RNzFL8ChzOY0CYUSkCMv7Ei2VfZXHprsUYD62sUTwioy4ait_SOp35ozg3cOg6qnSFkfAaDKyAb8HjZB_Tr_9MTjtEIvaIwue4nveVTLvd01wBGNV6AbSYTGzuFKVnoZa7d2Bs73o6QHPPYLA1_Ux/s2560/BYD-Song-Pro-Flex-2027-externo%20(10).jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhwEvnHUcUJ49enzqe7uWnBNs2Nl4ywSY-3HFnm-kS23YmeqWWWCfbkeN3mDbtQ2e_c2Y56d8awEEuKPTERbd2ItrSMszNHRAvhvC6e4ZQ00h-wqmJ42UYIoGcKQRMsmU61_yKwrL2wLPU2o064VaIFtzvNSGDc2UCWOS6Rfd63fcJ-l-LdI2PZ9NQ4h5XX/s2560/BYD-Song-Pro-Flex-2027-externo%20(12).jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEisMPtSHyVsex2sDrOAWChaOTYwWi3oO8SVM54U1YzM21ZSPNrhnh1vx5GJF-iRPK2rnK4TkgoQPpoVARH8ibye1dOpMpOipsUYIM2HXf16CNQqVVwJWu7oPZnWXo7im2x9uqaE4gbdQkQgXR3LyZqML26UvpWLekEZPaS3dyi_LbyVc-K93kc5JATdHWJg/s2560/BYD-Song-Pro-2027-flex-interior%20(12).jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiMC7GQIfOJhl7K1mL-6h8hQwBx94IqWpeL7ryHBNeAbrSbzicBN8IafkSsNYLiglZIjRWz6MqUYDP5s_sUYnJ619uQcsi-TaP30nZqGxpGGXxiLVB06khUT1rT02FNQU3phswJmj1oPLZDmpLp3RBGaX0FbYsQZUSYDrRl4zAJJ4tPTYtlFsVbHoke5ITs/s2560/BYD-Song-Pro-Flex-2027-externo%20(4).jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhA_VgzqGhQtFn2zpkqmvks_thW5idXXwC-hLtZPoIYCldtHJko_docq8lJ-erPCIrC_gyaVkBlp201Ij81d5zHtE3ExoRqdgZBpPDtMLUFRDqHedWjT21RGCVbKyTWhIVZXovJm3A_GZhe8Zf77oCR60N-oqXJUmL7osPexiSBxJ_44Y4Tx7alJOzfxQOI/s2560/BYD-Song-Pro-2027%20(10).jpg'
    ],
    omoda5:[
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiclpKilLN6Oib19gIw3R-j8dkvef1I4F7aqGkIoHlLiPDEmG3NhFABdxhYr4wwZAkXzcu2jjZ3zb9pXZO1K7I-IJk6KnPK6Oyh-dqaYku4cxIiWwMke3D0epFSxBCmNxmTm9mP2g0rmSpViciADzr5Jwn7R-da8y5qlxzO2so9yUm3r5-4-EI1J9ghz3Vu/s2560/Novo%20Omoda%205%20(20).jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgOVSHTzAYIxGE-EzFTdSmR8NU8yPHde25D6s2Tpf2bHupKaYmtlxUQTrNPiUXfv1aq7WzUEzi5-LKtoBkzJRep0J2DY283o7Xj5nq8Xqf19UVqZZm7upMGET30BJryMx7FJ2SigowiiqiYlacaVqaJfbleIgwWjdlzsKzdFJmNpIpXZ-cY72eutoEI5swY/s2560/Novo%20Omoda%205%20(22).jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgCZ0_SAB3cHKklnjUjy4JXpl4kgvl_Oy0iD2OFlwng7jcX74BekqT-lb6vuAJZtndMc5iEY2eJZjUT9vzAYaPn9t2RVm7IWkCBQmmJ1Iohsavy4b48l2EEquJgueGWXG8NOOnd9VRFk26Y6TH3WZjJYFFohVTlxIAnk1QcXtCnJpIo_FeQsVAcPoabcm6u/s2560/Novo%20Omoda%205%20(19).jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjL2s1IDJPjR63yx3fN-nxfZOtDcHRtkVJ_mJ80Du82JCmDVkeTPLho6MNXK_Y9f_XSxyKuLvkqczLKuyFzuoLG_qyS3E8zG6YtocOv3YfVhfGmAt16bitrQl5R99W0KbqtHdVt5Xntp6fcuZ-p12vnBE1-0ALXPwFWg9Gv7t_RRvaH5-FTxPWhgXi9Ackl/s2560/Novo%20Omoda%205%20(9).jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhjFCzeWx5wn2ciVPmmcdQf1R93qv5Ikl1tpNr7IeIN6mXQszFaS01r7urSvhMCtm_BOKBcnAuyTztfcMz9YfHrZ6M8UmoQJdJarpg-ExIBXENDa_Dm3DBzj7xr2jKVqFGw2EVi_0cqN0fdvZ4UKH_spTe9gtHi4xkNYJgYuf0gJOVFcuLLgczFOaACvVGW/s2560/Novo%20Omoda%205%20(10).jpg'
    ],
    tiggo7:[
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEip7UGQ_rvujE5w1LLQtGqP3WTkzvtoWT_ErhDyior2DiQM1dLZkD2UqUZttQj-YEUkw_v6cGG4J-WHfiHxmZNb00IJpyPSA6x5Olb4Kfyw5UojsLsunLI9Wmu7dn6I76yIkzkDAdk0bw7fISeseO-k3sqPCzK1KvjTNDdMapAECEmlc26RjTL9wSVmXm7-/s2560/Tiggo-7-PRO-Hybrid-2025%20(1).jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjjXg08XZTZjEXL43j0wUKToJY6j1ZSCB8DPVmLw5mzukq5A-dLEjo3uzcO6LKyMLJrxZWcdA4SFQR7PgGLvmmCm2q6HLCQzMFYLoDBLFz9DbFlXfDu0K6Kxqhe13ZSew_S7T7D99wQF8EjTyuO4F1AR0ddclRSOlcA_2kOfGdTQkouFgFTvnzotlIFnrka/s2048/08-Tiggo7%20RDUR0071.jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhCQGWDYYbf-mk8yVxjzQ_bZj6297aNNFPWXg_-PBLTdaDe0-Oah8JJ_savwy40o3Vx80PCFKSyLP0G00gszXNUbfLZyA6iZgzYqtHxBRV5KTJIqFQmv6Gz4sF1MWWcZbV5tjOSojI3Ry8rLdTBzSveJUWBB50bAXKro1gG0A5oBrOhR1RfSJx1yfZt0A3U/s2048/11-KV_TIGGO7PHEV2025_2.jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjeXTvnjb4it2AKXYcfts44nBO4szNrAI6qWJNXmRwegkzNHndBX1Qndp-xpWGGsZqPoDHJUpzx1ffiGvuBytRRG1nh9TgJc7y64LGYhOEEN5HRcNmP76L_XoUKVnkK0XCv1t9zXZMS_z5ik1WVfRliS_rCT-AIZTV7ZuB209Kpj1Dk0ucN_YWBaNfMDMKv/s2560/1-Tiggo7%20RDUR9220.jpg',
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgd5f9P3hC_pEPKEDBVAr1TVN-kHXHaVDIKZkO7kgGZ5Ku5ju25wrj8d10UtXhwTnC0R-zDTR11ubcxpiqLFgKdODk4AIrmSRt1duLuYPDsi-q08sr4VcBUicFXUSEIT8xdCXUNL4zynCMzPqSGXQcSCLbCfGhiP7sfQapN88NAXPvi6VAz1LvG6BF5AmVc/s2560/Tiggo-7-PRO-Hybrid-2025%20(2).jpg'
    ]
  };

const YOUTUBE = {
    dolphin_mini:['https://www.youtube.com/watch?v=lWvcjwT5sGE','https://www.youtube.com/watch?v=7Khfr8YyB0M'],
    ex2_pro:['https://www.youtube.com/watch?v=HzL-Pkl4AT8','https://www.youtube.com/watch?v=5V0kXn_AlMk'],
    mg4_c43:['https://www.youtube.com/watch?v=HAj8rtBf_NM','https://www.youtube.com/watch?v=X4nAj7SM9uI'],
    ex2_max:['https://www.youtube.com/watch?v=2xTusXM5uXg','https://www.youtube.com/watch?v=eQ-uTHC2OdI'],
    mg4_l43:['https://www.youtube.com/watch?v=6JFKyomNUqw','https://www.youtube.com/watch?v=HUioIzCcA0w'],
    dolphin_gs:['https://www.youtube.com/watch?v=JZfyDsfbTN0','https://www.youtube.com/watch?v=a2LWv0Mp8vw'],
    mg4_l54:['https://www.youtube.com/watch?v=iOdnLV552FU','https://www.youtube.com/watch?v=j_DghYtrWuQ'],
    ora5:['https://www.youtube.com/watch?v=TcEpTAIuw_g','https://www.youtube.com/watch?v=qhpbIvHl5pA'],
    dolphin_se:['https://www.youtube.com/watch?v=RZ0ISfM7Bk8','https://www.youtube.com/watch?v=f1U5za7N9-U'],
    ora03:['https://www.youtube.com/watch?v=Lxyfmepe_kY','https://www.youtube.com/watch?v=jQ-OTIYbcS0'],
    b10:['https://www.youtube.com/watch?v=BgSTz3qhGFg','https://www.youtube.com/watch?v=SCPRDUFRoNs'],
    atto2:['https://www.youtube.com/watch?v=Vs4P6UdUfKA','https://www.youtube.com/watch?v=0A8ketYFrxg'],
    jaecoo7:['https://www.youtube.com/watch?v=zsQepie0JEM','https://www.youtube.com/watch?v=F-NhEDADTDs'],
    songpro:['https://www.youtube.com/watch?v=ueGY3Uo8UDw','https://www.youtube.com/watch?v=nSv22jJk66w'],
    omoda5:['https://www.youtube.com/watch?v=vUARwNbbb5k','https://www.youtube.com/watch?v=3D7tSm7iIuc'],
    tiggo7:['https://www.youtube.com/watch?v=jo6AmVs6Ya8','https://www.youtube.com/watch?v=3voDzC0fS2Q']
  };

const GLOSSARY_TERMS = [
    { termo:'TCO', sigla:'TCO', categoria:'Financeiro', definicao:'Total Cost of Ownership — custo total de propriedade. Neste dashboard é o "Custo líquido": preço mais energia, seguro e manutenção ao longo do período, menos o valor recuperado na revenda.' },
    { termo:'BEV', sigla:'BEV', categoria:'Técnico', definicao:'Battery Electric Vehicle — carro 100% elétrico, movido só a bateria, sem motor a combustão.' },
    { termo:'ADAS', sigla:'ADAS', categoria:'Segurança', definicao:'Advanced Driver Assistance Systems — sistemas avançados de assistência ao motorista, como frenagem automática de emergência, alerta de saída de faixa e piloto adaptativo.' },
    { termo:'ACC', sigla:'ACC', categoria:'Segurança', definicao:'Adaptive Cruise Control — piloto automático adaptativo, que mantém distância do carro da frente ajustando a velocidade sozinho.' },
    { termo:'Latin NCAP', sigla:'', categoria:'Segurança', definicao:'Programa independente de testes de colisão para o mercado latino-americano. Resultado em estrelas (0 a 5); "não testado" significa que o modelo não passou pelo programa, não que seja inseguro.' },
    { termo:'Preço de tabela', sigla:'', categoria:'Financeiro', definicao:'Preço sugerido pela montadora em 09/08/2026, sem emplacamento, acessórios ou bônus promocionais.' },
    { termo:'R$/km', sigla:'', categoria:'Financeiro', definicao:'Custo líquido em 5 anos dividido pela quilometragem total rodada no período — o jeito mais direto de comparar carros com preços e usos diferentes.' },
    { termo:'R$/mês', sigla:'', categoria:'Financeiro', definicao:'Custo líquido em 5 anos dividido pelo número de meses de posse.' },
    { termo:'Autonomia', sigla:'', categoria:'Técnico', definicao:'Distância que o carro percorre com a bateria cheia, segundo o ciclo de homologação declarado pelo fabricante — na prática varia com clima, velocidade e uso do ar-condicionado.' },
    { termo:'Consumo', sigla:'', categoria:'Técnico', definicao:'Energia gasta a cada 100 km rodados, em kWh/100km. Quanto menor, mais eficiente o carro.' },
    { termo:'Porta-malas', sigla:'', categoria:'Técnico', definicao:'Capacidade do porta-malas em litros, com os bancos traseiros na posição normal.' },
    { termo:'Airbags', sigla:'', categoria:'Segurança', definicao:'Número de bolsas infláveis de proteção contra impacto instaladas de série no veículo.' },
    { termo:'Potência', sigla:'', categoria:'Técnico', definicao:'Potência máxima do motor elétrico, em cv (cavalos). Não entra no cálculo de custo, mas indica desempenho.' },
    { termo:'Revenda', sigla:'', categoria:'Financeiro', definicao:'Percentual do preço de tabela que o modelo deve recuperar na venda ao fim do período, calibrado por FIPE e pelo índice IBV Auto. O cenário "base" é o usado nas contas padrão do dashboard.' },
    { termo:'Índice de adequação', sigla:'', categoria:'Financeiro', definicao:'Nota de 0 a 100 que combina custo (30%), segurança (20%), autonomia (12%), rede de recarga (10%), revenda (10%), eficiência (8%), espaço (5%) e conforto (5%). É relativa ao conjunto de modelos visível após os filtros.' },
    { termo:'Nacional / Importado', sigla:'', categoria:'Regulatório', definicao:'Origem de fabricação do veículo. Não afeta diretamente o cálculo de custo, mas pode influenciar prazo de entrega e disponibilidade de peças.' },
    { termo:'Segundo carro', sigla:'', categoria:'Regulatório', definicao:'Premissa de uso deste dashboard: o elétrico é o segundo veículo da família, com rodagem menor (9.000 km/ano) e sem recarga em casa.' },
    { termo:'PHEV', sigla:'PHEV', categoria:'Técnico', definicao:'Plug-in Hybrid Electric Vehicle — híbrido com tomada: tem bateria e motor elétrico para uma autonomia elétrica curta, mais motor a combustão para o resto. Sem recarga em casa, roda quase sempre a combustão.' },
    { termo:'HEV', sigla:'HEV', categoria:'Técnico', definicao:'Hybrid Electric Vehicle — híbrido comum, sem tomada. A bateria carrega só por frenagem regenerativa e pelo próprio motor a combustão.' },
    { termo:'Combustível', sigla:'', categoria:'Financeiro', definicao:'Custo de gasolina/etanol em 5 anos para modelos PHEV e HEV, com base no consumo em km/l e no preço do combustível. Somado à energia elétrica (quando houver) para compor o "Consumo" e o critério de eficiência do índice.' }
  ];

const CUSTO_KM = [
    { cenario:'BEV com wallbox em casa a R$ 1,00/kWh', rsKm:0.162, nota:'Indisponível — condomínio não autoriza', destaque:'ref' },
    { cenario:'BEV BYD (Dolphin GS) — rede pública com 15% de desconto Shell', rsKm:0.317, nota:'Benefício exclusivo de proprietários BYD' },
    { cenario:'BEV eficiente (Geely EX2) — rede pública', rsKm:0.329, nota:'Melhor caso entre os importados' },
    { cenario:'PHEV como híbrido, 18 km/L gasolina', rsKm:0.350, nota:'Sem recarga, o PHEV vira híbrido comum' },
    { cenario:'PHEV flex, 12,5 km/L etanol', rsKm:0.352, nota:'Depende do preço do etanol em PE' },
    { cenario:'BEV BYD (Dolphin GS) — rede pública sem desconto', rsKm:0.373, nota:'Se o benefício não for ativado no app' },
    { cenario:'BEV GWM ORA 5 — rede pública', rsKm:0.403, nota:'Bateria maior, consumo maior' },
    { cenario:'PHEV como híbrido, 15 km/L gasolina', rsKm:0.420, nota:'Cenário urbano mais realista' },
    { cenario:'BEV GWM ORA 03 BEV58 — rede pública', rsKm:0.445, nota:'Mais caro que um PHEV a gasolina', destaque:'alerta' },
    { cenario:'Carro a combustão, 12 km/L gasolina', rsKm:0.525, nota:'Referência de comparação' }
  ];

const NAV_DEFS = [
    { id:'overview', label:'Visão geral', iconD:'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z' },
    { id:'compare', label:'Comparar', iconD:'M4 20V9M12 20V4M20 20v-6' },
    { id:'simulator', label:'Simulador', iconD:'M4 6h16M4 12h16M4 18h16' },
    { id:'sensitivity', label:'Sensibilidade', iconD:'M3 17l5-7 4 4 5-9 4 6' },
    { id:'spec', label:'Ficha técnica', iconD:'M6 3h8l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM9 12h7M9 16h7' },
    { id:'financing', label:'Formatos de compra', iconD:'M2 7h20v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1ZM2 7l2-4h16l2 4M6 14h4' },
    { id:'glossary', label:'Glossário', iconD:'M12 6.5c-2-1.5-5-2-8-1.5V18c3-.6 6 0 8 1.5c2-1.5 5-2.1 8-1.5V5C17 4.5 14 5 12 6.5ZM12 6.5V19.5' },
    { id:'sources', label:'Fontes', iconD:'M14 3h7v7M21 3l-9 9M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6' }
  ];

const FONTES_MONTADORAS = [
      { nome:'BYD Brasil — Dolphin Mini, Dolphin, Dolphin SE', url:'https://www.byd.com/br/car/dolphin-mini', extraido:'Preço de tabela, especificações, desconto de energia na rede Shell' },
      { nome:'Geely Brasil — EX2', url:'https://static.autoforce.com/plugins/files/clientes/geely-brasil/produtos/ws/Ficha_Tecnica_GEELY_EX2.pdf', extraido:'Ficha técnica, autonomia, recarga DC' },
      { nome:'MG Motor Brasil — MG4 Urban', url:'https://mgmotoroficial.com.br/model/mg4urban/', extraido:'Versões, preços, ADAS' },
      { nome:'GWM Brasil — ORA 5 e ORA 03 BEV58', url:'https://www.gwmmotors.com.br/pt/modelos/ora-03-bev58', extraido:'Preço, bônus comercial, Latin NCAP' },
      { nome:'Leapmotor B10 — FIPE', url:'https://www.mobiauto.com.br/tabela-fipe/carros/leapmotor/b10', extraido:'Preço de tabela FIPE 2026' }
    ];
const FONTES_SEGURANCA = [
      { nome:'Latin NCAP — resultados oficiais', url:'https://www.latinncap.com', extraido:'Resultado de colisão do ORA 03 e do Dolphin Plus' }
    ];
const FONTES_MERCADO = [
      { nome:'Tabela FIPE', url:'https://veiculos.fipe.org.br', extraido:'Valores de referência para calibrar os cenários de revenda' }
    ];
const FONTES_GROUPS = [
  { titulo: 'Montadoras', rows: FONTES_MONTADORAS },
  { titulo: 'Segurança', rows: FONTES_SEGURANCA },
  { titulo: 'Mercado e depreciação', rows: FONTES_MERCADO }
].map(g => ({ titulo: g.titulo, rows: g.rows.map(r => Object.assign({}, r, { status: 'Verificado em 09/08/2026' })) }));

const AGE_BASE = { '18-25': 0.035, '26-35': 0.028, '36-55': 0.023, '56+': 0.020 };
const ROLE_MULT = { unico: 1.10, segundo: 1.00, terceiro: 0.90 };
const RECARGA_PREMISSAS = {
  publica: { precoKwh: 2.30, fatorPerda: 1.05, label: 'Sem recarga em casa (rede pública)' },
  tomada:  { precoKwh: 0.95, fatorPerda: 1.02, label: 'Tomada comum em casa' },
  wallbox: { precoKwh: 0.85, fatorPerda: 1.01, label: 'Wallbox em casa' }
};

const PREMISSAS_DEFAULT = { kmAno: 9000, anos: 5, precoKwh: 2.30, fatorPerda: 1.05, seguroAno1: 0.035, seguroQueda: 0.005, cenario: 'base', emplacamento: 0, precoGasolina: 6.30 };
