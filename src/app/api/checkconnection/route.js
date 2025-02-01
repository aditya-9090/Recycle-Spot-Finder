import dbConnect from '@/app/utils/dbConnect';

export async function GET() {
  try {
    await dbConnect();
    return new Response(
      JSON.stringify({ message: 'Connected to the database' }),
      { status: 200 }
    );
  } catch {
    return new Response(
      JSON.stringify({ message: 'Database connection failed' }),
      { status: 500 }
    );
  }
}
