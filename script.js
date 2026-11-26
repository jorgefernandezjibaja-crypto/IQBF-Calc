
/* ============================================================
   IQBF-Calc
   Calculadora de requerimiento de IQBF
   Vicepresidencia de Investigación
   OG-IQBF - UNIFSLB
   Versión 1.4 - 2026
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
        nota: "La normalidad y el peso equivalente dependen de la reacción química específica."
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
        formula: "NH₃ (ac)",
        estado: "Líquido",
        pureza: 29.5,
        densidad: 0.89,
        masaMolar: 17.031,
        factor: 1,
        nota: "Producto comercial denominado hidróxido de amonio (NH₄OH). Los cálculos se realizan sobre la base del contenido de NH₃ al 29.5 % m/m. La masa molar formal del NH₄OH es 35.05 g/mol."
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
        nota: "La normalidad y el peso equivalente dependen de la reacción química específica."
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
        nota: "La normalidad y el peso equivalente dependen de la reacción química específica."
    },

    cacl2: {
        nombre: "Cloruro de calcio anhidro",
        formula: "CaCl₂",
        estado: "Sólido",
        pureza: 99,
        densidad: null,
        masaMolar: 110.99,
        factor: 2,
        nota: "Pureza asumida de 99 %. Normalidad referida a la precipitación de cloruros, con dos equivalentes por mol."
    }

};


// ============================================================
// 2. FORMATOS NUMÉRICOS
// ============================================================

function formatoCaracteristicas(valor) {

    if (!Number.isFinite(valor)) {
        return "No aplica";
    }

    return valor.toFixed(3);

}


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


function porcentajeMVProducto(insumo) {

    if (!esLiquido(insumo)) {
        return null;
    }

    return insumo.pureza * insumo.densidad;

}


// ============================================================
// 4. CONVERSIONES DE UNIDADES
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


function convertirAGramos(cantidad, unidad) {

    switch (unidad) {

        case "g":
            return cantidad;

        case "kg":
            return cantidad * 1000;

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
// 8. REPRESENTACIÓN DE FRACCIONES MATEMÁTICAS
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
// 9. FÓRMULA Y LEYENDA DINÁMICA
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


    // PORCENTAJE MASA / MASA

    else if (tipo === "porcentaje_mm") {

        formula = "m = " + fraccion(
            "C × m<sub>f</sub>",
            "P"
        );

        leyenda = [

            ["m", "Masa requerida del producto comercial (g)."],
            ["C", "Concentración requerida (% m/m)."],
            ["m<sub>f</sub>", "Masa final de la solución (g)."],
            ["P", "Pureza del producto comercial (% m/m)."]

        ];

    }


    // PORCENTAJE MASA / VOLUMEN

    else if (tipo === "porcentaje_mv") {

        formula = "m = " + fraccion(
            "C × V",
            "P"
        );

        leyenda = [

            ["m", "Masa requerida del producto comercial (g)."],
            ["C", "Concentración requerida (% m/v)."],
            ["V", "Volumen final de la solución (mL)."],
            ["P", "Pureza del producto comercial (% m/m)."]

        ];

    }


    // PORCENTAJE VOLUMEN / VOLUMEN COMERCIAL

    else if (tipo === "porcentaje_vv") {

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


    $("formula").innerHTML = formula;


    $("leyendaFormula").innerHTML =

        "<strong>Donde:</strong>" +

        leyenda.map(item => `

            <div class="variable-formula">

                <strong>${item[0]}:</strong>

                ${item[1]}

            </div>

        `).join("");

}


// ============================================================
// 10. CARACTERÍSTICAS DEL INSUMO
// ============================================================

function actualizarPropiedades() {

    const insumo = obtenerInsumo();

    limpiarResultados();


    if (!insumo) {

        [

            "formulaQuimica",
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


        actualizarTipoCalculo();

        return;

    }


    $("formulaQuimica").textContent =
        insumo.formula;


    $("estado").textContent =
        insumo.estado;


    $("pureza").textContent =
        insumo.pureza + " % m/m";


    $("densidad").textContent =

        esLiquido(insumo)

        ? insumo.densidad + " g/mL"

        : "No requerida";


    $("masaMolar").textContent =
        formatoCaracteristicas(insumo.masaMolar) +
        " g/mol";


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


    actualizarTipoCalculo();

}


// ============================================================
// 11. HABILITAR TIPOS DE CONCENTRACIÓN
// ============================================================

function actualizarOpcionesConcentracion() {

    const insumo = obtenerInsumo();

    const selector = $("tipoCalculo");


    const opcionNormalidad = selector.querySelector(
        'option[value="normalidad"]'
    );


    const opcionVV = selector.querySelector(
        'option[value="porcentaje_vv"]'
    );


    opcionNormalidad.disabled =
        !!insumo && !insumo.factor;


    opcionVV.disabled =
        !!insumo && !esLiquido(insumo);


    if (

        selector.value === "normalidad" &&
        opcionNormalidad.disabled

    ) {

        selector.value = "molaridad";

    }


    if (

        selector.value === "porcentaje_vv" &&
        opcionVV.disabled

    ) {

        selector.value = "porcentaje_mv";

    }

}


// ============================================================
// 12. UNIDADES DE INGRESO DINÁMICAS
// ============================================================

function actualizarUnidades() {

    const tipo = $("tipoCalculo").value;

    const selectorUnidad = $("unidad");

    const unidadAnterior = selectorUnidad.value;


    if (tipo === "porcentaje_mm") {

        selectorUnidad.innerHTML = `

            <option value="g">
                Gramos (g)
            </option>

            <option value="kg">
                Kilogramos (kg)
            </option>

        `;


        $("labelUnidad").textContent =
            "Unidad de la masa final de la solución";


        $("labelCantidad").textContent =
            "Masa final de la solución";


        $("cantidad").placeholder =
            "Ingrese la masa final";


        if (["g", "kg"].includes(unidadAnterior)) {

            selectorUnidad.value = unidadAnterior;

        } else {

            selectorUnidad.value = "g";

            $("cantidad").value = "";

        }

    } else {

        selectorUnidad.innerHTML = `

            <option value="ml">
                Mililitros (mL)
            </option>

            <option value="l">
                Litros (L)
            </option>

            <option value="gotas">
                Gotas
            </option>

        `;


        $("labelUnidad").textContent =
            "Unidad del volumen final de la solución";


        $("labelCantidad").textContent =
            "Volumen final de la solución";


        $("cantidad").placeholder =
            "Ingrese el volumen final";


        if (["ml", "l", "gotas"].includes(unidadAnterior)) {

            selectorUnidad.value = unidadAnterior;

        } else {

            selectorUnidad.value = "ml";

            $("cantidad").value = "";

        }

    }

}


// ============================================================
// 13. ETIQUETA DEL TIPO DE CONCENTRACIÓN
// ============================================================

function actualizarTipoCalculo() {

    actualizarOpcionesConcentracion();

    limpiarResultados();

    const tipo = $("tipoCalculo").value;


    const etiquetas = {

        normalidad:
            "Concentración requerida (eq/L)",

        molaridad:
            "Concentración requerida (mol/L)",

        porcentaje_mm:
            "Concentración requerida (% m/m)",

        porcentaje_mv:
            "Concentración requerida (% m/v)",

        porcentaje_vv:
            "Concentración requerida (% v/v comercial)"

    };


    $("labelConcentracion").textContent =
        etiquetas[tipo] || "Concentración requerida";


    actualizarUnidades();

    actualizarFormula();

    actualizarConsideraciones();

}


// ============================================================
// 14. CONSIDERACIONES TÉCNICAS
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


    if (tipo === "porcentaje_mm") {

        notas.push(

            "El porcentaje m/m expresa gramos de sustancia pura por cada 100 g de solución final."

        );

    }


    if (tipo === "porcentaje_mv") {

        notas.push(

            "El porcentaje m/v expresa gramos de sustancia pura por cada 100 mL de solución final."

        );

    }


    if (tipo === "porcentaje_vv") {

        notas.push(

            "El porcentaje v/v expresa el volumen del producto comercial respecto al volumen final de la solución. No representa la pureza de la sustancia química."

        );

    }


    if (tipo !== "porcentaje_vv") {

        notas.push(

            "La masa requerida considera la pureza del producto comercial."

        );

    }


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

            "Equivalencia referencial: 20 gotas/mL. El volumen real de una gota depende del líquido y del dispensador."

        );

    }


    notas.push(

        "Los cálculos internos se realizan sin redondeos intermedios."

    );


    notas.push(

        "Los resultados visibles presentan un máximo de seis decimales."

    );


    notas.push(

        "Los cálculos son teóricos y no verifican la solubilidad, compatibilidad, estabilidad ni las condiciones de preparación segura."

    );


    $("consideraciones").innerHTML =

        notas.map(nota => `<p>${nota}</p>`).join("");

}


// ============================================================
// 15. MOTOR PRINCIPAL DE CÁLCULO
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

    const P = insumo.pureza;

    const pureza = P / 100;


    // VALIDACIÓN DE LOS DATOS DE ENTRADA

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


    let volumenML = null;

    let volumenL = null;

    let masaFinalG = null;

    let masaG = 0;

    let detalle = "";


    // CONVERSIÓN DE LA CANTIDAD FINAL

    if (tipo === "porcentaje_mm") {

        masaFinalG =
            convertirAGramos(cantidad, unidad);


        if (

            !Number.isFinite(masaFinalG) ||
            masaFinalG <= 0

        ) {

            mostrarError(
                "La masa final de la solución no es válida."
            );

            return;

        }

    } else {

        volumenML =
            convertirAMililitros(cantidad, unidad);

        volumenL = volumenML / 1000;


        if (

            !Number.isFinite(volumenML) ||
            volumenML <= 0

        ) {

            mostrarError(
                "El volumen final de la solución no es válido."
            );

            return;

        }

    }


// ============================================================
// 16. CÁLCULO POR NORMALIDAD
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

                    "La normalidad requerida supera la normalidad del producto existente (" +

                    formatoCompleto(N1) +

                    " eq/L)."

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

            `${P} / 100`

        );

    }


// ============================================================
// 17. CÁLCULO POR MOLARIDAD
// ============================================================

    else if (tipo === "molaridad") {

        if (esLiquido(insumo)) {

            const M1 = molaridadProducto(insumo);


            if (concentracion > M1) {

                mostrarError(

                    "La molaridad requerida supera la molaridad del producto existente (" +

                    formatoCompleto(M1) +

                    " mol/L)."

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

            `${P} / 100`

        );

    }


// ============================================================
// 18. CÁLCULO POR PORCENTAJE MASA / MASA
// ============================================================

    else if (tipo === "porcentaje_mm") {

        if (concentracion > P) {

            mostrarError(

                "La concentración requerida supera la pureza del producto comercial (" +

                P +

                " % m/m). No puede obtenerse mediante dilución."

            );

            return;

        }


        masaG = (

            concentracion *
            masaFinalG

        ) / P;


        detalle = "m = " + fraccion(

            `${formatoCompleto(concentracion)} × ${formatoCompleto(masaFinalG)}`,

            formatoCompleto(P)

        );

    }


// ============================================================
// 19. CÁLCULO POR PORCENTAJE MASA / VOLUMEN
// ============================================================

    else if (tipo === "porcentaje_mv") {

        if (esLiquido(insumo)) {

            const limiteMV =
                porcentajeMVProducto(insumo);


            if (concentracion > limiteMV) {

                mostrarError(

                    "La concentración requerida supera la concentración comercial de referencia (" +

                    formatoResultados(limiteMV) +

                    " % m/v). No se admite para el cálculo por dilución."

                );

                return;

            }

        }


        masaG = (

            concentracion *
            volumenML

        ) / P;


        detalle = "m = " + fraccion(

            `${formatoCompleto(concentracion)} × ${formatoCompleto(volumenML)}`,

            formatoCompleto(P)

        );

    }


// ============================================================
// 20. CÁLCULO POR PORCENTAJE VOLUMEN / VOLUMEN
// ============================================================

    else if (tipo === "porcentaje_vv") {

        if (!esLiquido(insumo)) {

            mostrarError(

                "El porcentaje v/v comercial solamente es aplicable a insumos líquidos."

            );

            return;

        }


        if (concentracion > 100) {

            mostrarError(

                "El porcentaje v/v del producto comercial no puede superar el 100 %."

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


    else {

        mostrarError(
            "Seleccione un tipo de concentración válido."
        );

        return;

    }


// ============================================================
// 21. VALIDACIÓN DEL RESULTADO
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


    if (esLiquido(insumo)) {

        if (

            !Number.isFinite(
                (masaG / insumo.densidad) *
                GOTAS_POR_ML
            )

        ) {

            mostrarError(
                "El resultado excede el rango numérico."
            );

            return;

        }

    }


// ============================================================
// 22. PRESENTACIÓN FINAL DEL CÁLCULO
// ============================================================

    mostrarResultados(masaG, insumo);


    const resultadoMasa =
        formatoResultados(masaG);


    const signo =
        resultadoMasa.startsWith("<") ? "" : "= ";


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
// 23. LIMPIAR DATOS
// ============================================================

function limpiarDatos() {

    $("concentracion").value = "";

    $("cantidad").value = "";


    $("unidad").value =

        $("tipoCalculo").value === "porcentaje_mm"

        ? "g"

        : "ml";


    limpiarResultados();

    actualizarFormula();

    actualizarConsideraciones();

}


// ============================================================
// 24. EVENTOS DE LA INTERFAZ
// ============================================================

$("insumo").addEventListener(

    "change",

    actualizarPropiedades

);


$("tipoCalculo").addEventListener(

    "change",

    () => {

        $("concentracion").value = "";

        $("cantidad").value = "";

        actualizarTipoCalculo();

    }

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
// 25. INICIALIZACIÓN DE IQBF-CALC
// ============================================================

actualizarPropiedades();
