
/* ============================================================
   IQBF-Calc
   Calculadora de requerimiento de IQBF
   OG-IQBF - UNIFSLB
   Versión 1.2 - 2026
   ============================================================ */

const $ = id => document.getElementById(id);

const GOTAS_POR_ML = 20;


// ============================================================
// 1. BASE DE DATOS DE INSUMOS QUÍMICOS
// ============================================================

const insumos = {

    acetona: {
        nombre: "Acetona",
        formula: "C₃H₆O",
        estado: "Líquido",
        pureza: 99.98,
        densidad: 0.79,
        masaMolar: 58.08,
        factor: null,
        nota: "La normalidad depende de la reacción química."
    },

    hcl: {
        nombre: "Ácido clorhídrico",
        formula: "HCl",
        estado: "Líquido",
        pureza: 37,
        densidad: 1.19,
        masaMolar: 36.46,
        factor: 1,
        nota: "Normalidad referida a neutralización ácido-base."
    },

    hno3: {
        nombre: "Ácido nítrico",
        formula: "HNO₃",
        estado: "Líquido",
        pureza: 65.29,
        densidad: 1.41,
        masaMolar: 63.01,
        factor: 1,
        nota: "Normalidad referida a neutralización ácido-base."
    },

    h2so4: {
        nombre: "Ácido sulfúrico",
        formula: "H₂SO₄",
        estado: "Líquido",
        pureza: 96.4,
        densidad: 1.84,
        masaMolar: 98.08,
        factor: 2,
        nota: "Normalidad referida a la neutralización completa de los dos protones."
    },

    amoniaco: {
        nombre: "Amoniaco",
        formula: "NH₃",
        estado: "Líquido",
        pureza: 29.5,
        densidad: 0.89,
        masaMolar: 17.031,
        factor: 1,
        nota: "Se asume que el porcentaje comercial corresponde a NH₃ en masa. Verificar la etiqueta del producto."
    },

    na2co3: {
        nombre: "Carbonato de sodio",
        formula: "Na₂CO₃",
        estado: "Sólido",
        pureza: 99.7,
        densidad: null,
        masaMolar: 105.99,
        factor: 2,
        nota: "Normalidad referida a la neutralización completa del carbonato."
    },

    nh4cl: {
        nombre: "Cloruro de amonio",
        formula: "NH₄Cl",
        estado: "Sólido",
        pureza: 99.8,
        densidad: null,
        masaMolar: 53.49,
        factor: 1,
        nota: "Peso equivalente referido a una reacción ácido-base de un equivalente por mol de NH₄⁺."
    },

    eter: {
        nombre: "Éter etílico",
        formula: "C₄H₁₀O",
        estado: "Líquido",
        pureza: 99.9,
        densidad: 0.715,
        masaMolar: 74.12,
        factor: null,
        nota: "La normalidad depende de la reacción química."
    },

    kmno4: {
        nombre: "Permanganato de potasio",
        formula: "KMnO₄",
        estado: "Sólido",
        pureza: 99,
        densidad: null,
        masaMolar: 158.04,
        factor: 5,
        nota: "Normalidad referida exclusivamente a la reducción del permanganato a Mn²⁺ en medio ácido."
    },

    naoh: {
        nombre: "Hidróxido de sodio",
        formula: "NaOH",
        estado: "Sólido",
        pureza: 98.5,
        densidad: null,
        masaMolar: 40,
        factor: 1,
        nota: "Normalidad referida a neutralización ácido-base."
    },

    benceno: {
        nombre: "Benceno",
        formula: "C₆H₆",
        estado: "Líquido",
        pureza: 99,
        densidad: 0.88,
        masaMolar: 78.11,
        factor: null,
        nota: "La normalidad depende de la reacción química."
    },

    cacl2: {
        nombre: "Cloruro de calcio anhidro",
        formula: "CaCl₂",
        estado: "Sólido",
        pureza: 99,
        densidad: null,
        masaMolar: 110.98,
        factor: 2,
        nota: "Pureza asumida de 99 %. Normalidad referida a la precipitación de cloruros, con dos equivalentes por mol."
    }

};


// ============================================================
// 2. FUNCIONES DE FORMATO NUMÉRICO
// ============================================================

// Exactamente tres decimales para características químicas.

function formatoCaracteristicas(valor) {

    if (!Number.isFinite(valor)) {
        return "No aplica";
    }

    return valor.toFixed(3);

}


// Máximo seis decimales para los resultados.

function formatoResultados(valor) {

    if (!Number.isFinite(valor)) {
        return "No aplica";
    }

    if (valor > 0 && valor < 0.0000005) {
        return "< 0.000001";
    }

    return valor.toLocaleString("en-US", {
        useGrouping: false,
        maximumFractionDigits: 6
    });

}


// Conserva la precisión numérica disponible
// para mostrar los valores utilizados en el cálculo.

function formatoCompleto(valor) {

    if (!Number.isFinite(valor)) {
        return "No aplica";
    }

    return String(valor);

}


// ============================================================
// 3. FUNCIONES QUÍMICAS
// ============================================================

function obtenerInsumo() {

    return insumos[$("insumo").value] || null;

}


function esLiquido(insumo) {

    return insumo.estado === "Líquido";

}


function pesoEquivalente(insumo) {

    if (!insumo.factor) {
        return null;
    }

    return insumo.masaMolar / insumo.factor;

}


function molaridadProducto(insumo) {

    if (!esLiquido(insumo)) {
        return null;
    }

    return (
        insumo.pureza *
        insumo.densidad *
        10
    ) / insumo.masaMolar;

}


function normalidadProducto(insumo) {

    if (!esLiquido(insumo) || !insumo.factor) {
        return null;
    }

    return (
        insumo.pureza *
        insumo.densidad *
        10
    ) / pesoEquivalente(insumo);

}


// ============================================================
// 4. CONVERSIÓN DEL VOLUMEN FINAL
// ============================================================

function convertirAMililitros(cantidad, unidad) {

    switch (unidad) {

        case "ml":
            return cantidad;

        case "l":
            return cantidad * 1000;

        case "gotas":
            return cantidad / GOTAS_POR_ML;

        default:
            return NaN;

    }

}


// ============================================================
// 5. MENSAJES DE ERROR
// ============================================================

function mostrarError(texto) {

    const mensaje = $("mensaje");

    mensaje.textContent = texto;

    mensaje.style.display = "block";

    mensaje.style.backgroundColor = "#fff3cd";

    mensaje.style.color = "#856404";

    mensaje.style.padding = "10px";

    mensaje.style.borderRadius = "5px";

    mensaje.style.marginBottom = "12px";

}


function ocultarMensaje() {

    const mensaje = $("mensaje");

    mensaje.textContent = "";

    mensaje.style.display = "none";

}


// ============================================================
// 6. LIMPIAR RESULTADOS
// ============================================================

function limpiarResultados() {

    const campos = [

        "resultadoKG",
        "resultadoG",
        "resultadoL",
        "resultadoML",
        "resultadoGotas"

    ];

    campos.forEach(id => {

        $(id).textContent = "—";

    });

    $("detalle").textContent = "—";

    ocultarMensaje();

}


// ============================================================
// 7. MOSTRAR RESULTADOS
// ============================================================

function mostrarResultados(masaG, insumo) {

    $("resultadoKG").textContent =
        formatoResultados(masaG / 1000);

    $("resultadoG").textContent =
        formatoResultados(masaG);


    if (esLiquido(insumo)) {

        const volumenML =
            masaG / insumo.densidad;

        const volumenL =
            volumenML / 1000;

        const gotas =
            volumenML * GOTAS_POR_ML;


        $("resultadoL").textContent =
            formatoResultados(volumenL);

        $("resultadoML").textContent =
            formatoResultados(volumenML);

        $("resultadoGotas").textContent =
            "≈ " + formatoResultados(gotas);

    } else {

        $("resultadoL").textContent =
            "No aplica";

        $("resultadoML").textContent =
            "No aplica";

        $("resultadoGotas").textContent =
            "No aplica";

    }

}


// ============================================================
// 8. REPRESENTACIÓN VISUAL DE FRACCIONES
// ============================================================

function fraccion(numerador, denominador) {

    return `

        <span class="fraccion">

            <span class="numerador">
                ${numerador}
            </span>

            <span class="denominador">
                ${denominador}
            </span>

        </span>

    `;

}


// ============================================================
// 9. FÓRMULA MATEMÁTICA Y LEYENDA DINÁMICA
// ============================================================

function actualizarFormula() {

    const insumo = obtenerInsumo();

    const tipo = $("tipoCalculo").value;


    if (!insumo) {

        $("formula").textContent = "—";

        $("leyendaFormula").innerHTML = "";

        return;

    }


    let formula = "";

    let leyenda = [];


    // NORMALIDAD

    if (tipo === "normalidad") {

        formula = "m = " + fraccion(

            "N × PE × V",

            "P / 100"

        );


        leyenda = [

            ["m", "Masa requerida del producto comercial (g)."],

            ["N", "Normalidad requerida (eq/L)."],

            ["PE", "Peso equivalente (g/eq)."],

            ["V", "Volumen final de la solución (L)."],

            ["P", "Pureza del producto comercial (% m/m)."]

        ];

    }


    // MOLARIDAD

    else if (tipo === "molaridad") {

        formula = "m = " + fraccion(

            "M × MM × V",

            "P / 100"

        );


        leyenda = [

            ["m", "Masa requerida del producto comercial (g)."],

            ["M", "Molaridad requerida (mol/L)."],

            ["MM", "Masa molar (g/mol)."],

            ["V", "Volumen final de la solución (L)."],

            ["P", "Pureza del producto comercial (% m/m)."]

        ];

    }


    // PORCENTAJE VOLUMEN / VOLUMEN

    else if (
        tipo === "porcentaje" &&
        esLiquido(insumo)
    ) {

        formula = "m = " + fraccion(

            "C × V × ρ",

            "100"

        );


        leyenda = [

            ["m", "Masa requerida del producto comercial (g)."],

            ["C", "Concentración requerida (% v/v del producto comercial)."],

            ["V", "Volumen final de la solución (mL)."],

            ["ρ", "Densidad del producto comercial (g/mL)."]

        ];

    }


    // PORCENTAJE MASA / VOLUMEN

    else if (tipo === "porcentaje") {

        formula = "m = " + fraccion(

            "C × V",

            "100 × (P / 100)"

        );


        leyenda = [

            ["m", "Masa requerida del producto comercial (g)."],

            ["C", "Concentración requerida (% m/v)."],

            ["V", "Volumen final de la solución (mL)."],

            ["P", "Pureza del producto comercial (% m/m)."]

        ];

    }


    $("formula").innerHTML = formula;


    $("leyendaFormula").innerHTML =

        "<strong>Donde:</strong>" +

        leyenda.map(item => {

            return `

                <div class="variable-formula">

                    <strong>${item[0]}:</strong>

                    ${item[1]}

                </div>

            `;

        }).join("");

}


// ============================================================
// 10. CARACTERÍSTICAS DEL INSUMO EXISTENTE
// ============================================================

function actualizarPropiedades() {

    const insumo = obtenerInsumo();

    limpiarResultados();


    if (!insumo) {

        [

            "estado",
            "pureza",
            "densidad",
            "masaMolar",
            "pesoEquivalente",
            "normalidadExistente",
            "molaridadExistente"

        ].forEach(id => {

            $(id).textContent = "—";

        });


        $("tipoCalculo").querySelector(
            'option[value="normalidad"]'
        ).disabled = false;


        actualizarTipoCalculo();

        return;

    }


    $("estado").textContent =
        insumo.estado;


    $("pureza").textContent =
        insumo.pureza + " %";


    $("densidad").textContent =
        esLiquido(insumo)

        ? insumo.densidad + " g/mL"

        : "No requerida";


    $("masaMolar").textContent =

        formatoCaracteristicas(
            insumo.masaMolar
        ) + " g/mol";


    const PE = pesoEquivalente(insumo);


    $("pesoEquivalente").textContent =

        PE !== null

        ? formatoCaracteristicas(PE) + " g/eq"

        : "No definido";


    const N = normalidadProducto(insumo);


    $("normalidadExistente").textContent =

        N !== null

        ? formatoCaracteristicas(N) + " eq/L"

        : "No aplica";


    const M = molaridadProducto(insumo);


    $("molaridadExistente").textContent =

        M !== null

        ? formatoCaracteristicas(M) + " mol/L"

        : "No aplica";


    const opcionNormalidad =

        $("tipoCalculo").querySelector(
            'option[value="normalidad"]'
        );


    opcionNormalidad.disabled =
        insumo.factor === null;


    if (
        insumo.factor === null &&
        $("tipoCalculo").value === "normalidad"
    ) {

        $("tipoCalculo").value = "molaridad";

    }


    actualizarTipoCalculo();

}


// ============================================================
// 11. TIPO DE CONCENTRACIÓN
// ============================================================

function actualizarTipoCalculo() {

    const insumo = obtenerInsumo();

    const tipo = $("tipoCalculo").value;


    limpiarResultados();


    const opcionPorcentaje =

        $("tipoCalculo").querySelector(
            'option[value="porcentaje"]'
        );


    if (!insumo) {

        opcionPorcentaje.textContent =
            "Porcentaje (%)";

    } else if (esLiquido(insumo)) {

        opcionPorcentaje.textContent =
            "Porcentaje (% v/v)";

    } else {

        opcionPorcentaje.textContent =
            "Porcentaje (% m/v)";

    }


    switch (tipo) {

        case "normalidad":

            $("labelConcentracion").textContent =
                "Concentración requerida (eq/L)";

            break;


        case "molaridad":

            $("labelConcentracion").textContent =
                "Concentración requerida (mol/L)";

            break;


        case "porcentaje":

            $("labelConcentracion").textContent =

                !insumo

                ? "Concentración requerida (%)"

                : esLiquido(insumo)

                    ? "Concentración requerida (% v/v)"

                    : "Concentración requerida (% m/v)";

            break;

    }


    actualizarFormula();

    actualizarConsideraciones();

}


// ============================================================
// 12. CONSIDERACIONES TÉCNICAS
// ============================================================

function actualizarConsideraciones() {

    const insumo = obtenerInsumo();

    const tipo = $("tipoCalculo").value;


    if (!insumo) {

        $("consideraciones").textContent =
            "Seleccione un insumo químico.";

        return;

    }


    const notas = [insumo.nota];


    if (esLiquido(insumo)) {

        notas.push(

            "El volumen requerido del producto comercial se obtiene dividiendo la masa entre su densidad."

        );

    }


    if (
        esLiquido(insumo) ||
        $("unidad").value === "gotas"
    ) {

        notas.push(

            "Equivalencia referencial: 20 gotas/mL."

        );

    }


    if (
        tipo === "porcentaje" &&
        esLiquido(insumo)
    ) {

        notas.push(

            "El porcentaje v/v se refiere al volumen del producto comercial respecto al volumen final."

        );

    } else {

        notas.push(

            "La masa requerida considera la pureza del producto comercial."

        );

    }


    notas.push(

        "Los cálculos internos se realizan sin redondeos intermedios."

    );


    notas.push(

        "Los resultados visibles presentan un máximo de seis decimales."

    );


    notas.push(

        "Los resultados no verifican la solubilidad, compatibilidad ni las condiciones de preparación segura."

    );


    $("consideraciones").innerHTML =

        notas.map(nota =>

            `<p>${nota}</p>`

        ).join("");

}


// ============================================================
// 13. MOTOR PRINCIPAL DE CÁLCULO
// ============================================================

function calcularRequerimiento() {

    limpiarResultados();


    const insumo = obtenerInsumo();


    if (!insumo) {

        mostrarError(
            "Seleccione un insumo químico."
        );

        return;

    }


    const tipo = $("tipoCalculo").value;

    const concentracion =
        parseFloat($("concentracion").value);

    const cantidad =
        parseFloat($("cantidad").value);

    const unidad = $("unidad").value;

    const pureza = insumo.pureza / 100;


    // VALIDACIÓN DE DATOS

    if (
        !Number.isFinite(concentracion) ||
        concentracion <= 0
    ) {

        mostrarError(
            "Ingrese una concentración mayor que cero."
        );

        return;

    }


    if (
        !Number.isFinite(cantidad) ||
        cantidad <= 0
    ) {

        mostrarError(
            "Ingrese una cantidad final mayor que cero."
        );

        return;

    }


    if (
        !Number.isFinite(pureza) ||
        pureza <= 0 ||
        pureza > 1
    ) {

        mostrarError(
            "La pureza del producto no es válida."
        );

        return;

    }


    const volumenML =

        convertirAMililitros(cantidad, unidad);


    const volumenL = volumenML / 1000;


    if (
        !Number.isFinite(volumenML) ||
        volumenML <= 0
    ) {

        mostrarError(
            "El volumen final no es válido."
        );

        return;

    }


    let masaG = 0;

    let detalle = "";


// ============================================================
// 14. CÁLCULO POR NORMALIDAD
// ============================================================

    if (tipo === "normalidad") {

        const PE = pesoEquivalente(insumo);


        if (PE === null) {

            mostrarError(
                "La normalidad no está definida para este insumo."
            );

            return;

        }


        if (esLiquido(insumo)) {

            const N1 = normalidadProducto(insumo);


            if (concentracion > N1) {

                mostrarError(

                    "La normalidad requerida supera la normalidad del producto existente."

                );

                return;

            }

        }


        masaG = (

            concentracion *
            PE *
            volumenL

        ) / pureza;


        detalle = "m = " + fraccion(

            `${formatoCompleto(concentracion)} × ${formatoCompleto(PE)} × ${formatoCompleto(volumenL)}`,

            `${insumo.pureza} / 100`

        );

    }


// ============================================================
// 15. CÁLCULO POR MOLARIDAD
// ============================================================

    else if (tipo === "molaridad") {

        if (esLiquido(insumo)) {

            const M1 = molaridadProducto(insumo);


            if (concentracion > M1) {

                mostrarError(

                    "La molaridad requerida supera la molaridad del producto existente."

                );

                return;

            }

        }


        masaG = (

            concentracion *
            insumo.masaMolar *
            volumenL

        ) / pureza;


        detalle = "m = " + fraccion(

            `${formatoCompleto(concentracion)} × ${formatoCompleto(insumo.masaMolar)} × ${formatoCompleto(volumenL)}`,

            `${insumo.pureza} / 100`

        );

    }


// ============================================================
// 16. CÁLCULO POR PORCENTAJE V/V
// ============================================================

    else if (
        tipo === "porcentaje" &&
        esLiquido(insumo)
    ) {

        if (concentracion > 100) {

            mostrarError(
                "El porcentaje v/v no puede superar el 100 %."
            );

            return;

        }


        masaG = (

            concentracion *
            volumenML *
            insumo.densidad

        ) / 100;


        detalle = "m = " + fraccion(

            `${formatoCompleto(concentracion)} × ${formatoCompleto(volumenML)} × ${formatoCompleto(insumo.densidad)}`,

            "100"

        );

    }


// ============================================================
// 17. CÁLCULO POR PORCENTAJE M/V
// ============================================================

    else if (tipo === "porcentaje") {

        masaG = (

            concentracion *
            volumenML

        ) / (100 * pureza);


        detalle = "m = " + fraccion(

            `${formatoCompleto(concentracion)} × ${formatoCompleto(volumenML)}`,

            `100 × (${insumo.pureza} / 100)`

        );

    }


// ============================================================
// 18. VALIDACIÓN Y PRESENTACIÓN DE RESULTADOS
// ============================================================

    if (
        !Number.isFinite(masaG) ||
        masaG <= 0
    ) {

        mostrarError(
            "No fue posible obtener un resultado válido."
        );

        return;

    }


    if (
        esLiquido(insumo) &&
        !Number.isFinite(masaG / insumo.densidad)
    ) {

        mostrarError(
            "El volumen calculado excede el rango numérico."
        );

        return;

    }


    mostrarResultados(masaG, insumo);


    const resultadoMasa = formatoResultados(masaG);

    const signo = resultadoMasa.startsWith("<")

        ? ""

        : "= ";


    $("detalle").innerHTML = `

        <div class="operacion-matematica">

            ${detalle}

        </div>

        <div class="resultado-masa">

            m ${signo}${resultadoMasa.replace("<", "&lt;")} g

        </div>

    `;


    actualizarFormula();

    actualizarConsideraciones();

    ocultarMensaje();

}


// ============================================================
// 19. LIMPIAR DATOS INGRESADOS
// ============================================================

function limpiarDatos() {

    $("concentracion").value = "";

    $("cantidad").value = "";

    $("unidad").value = "ml";


    limpiarResultados();

    actualizarFormula();

    actualizarConsideraciones();

}


// ============================================================
// 20. EVENTOS DE LA INTERFAZ
// ============================================================

$("insumo").addEventListener(

    "change",

    actualizarPropiedades

);


$("tipoCalculo").addEventListener(

    "change",

    actualizarTipoCalculo

);


$("btnCalcular").addEventListener(

    "click",

    calcularRequerimiento

);


$("btnLimpiar").addEventListener(

    "click",

    limpiarDatos

);


["concentracion", "cantidad"].forEach(id => {

    $(id).addEventListener(

        "input",

        limpiarResultados

    );

});


$("unidad").addEventListener(

    "change",

    () => {

        limpiarResultados();

        actualizarConsideraciones();

    }

);


["concentracion", "cantidad"].forEach(id => {

    $(id).addEventListener(

        "keydown",

        evento => {

            if (evento.key === "Enter") {

                calcularRequerimiento();

            }

        }

    );

});


// ============================================================
// 21. INICIALIZACIÓN DE IQBF-CALC
// ============================================================

actualizarPropiedades();
