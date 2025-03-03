export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const barcode = searchParams.get('barcode');
  
    if (!barcode) {
      return new Response(JSON.stringify({ error: "Barcode is required" }), { status: 400 });
    }
  
    const apiUrl = `https://products-test-aci.onrender.com/product/${barcode}`;
  
    try {
      const response = await fetch(apiUrl, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
  
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
  
    } catch (error) {
      console.error("Error fetching product:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch product data" }), {
        status: 500,
      });
    }
  }
  