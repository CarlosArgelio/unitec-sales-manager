# Generated migration to make Category code editable

from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('products', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='code',
            field=models.CharField(max_length=50, primary_key=True),
        ),
    ]
